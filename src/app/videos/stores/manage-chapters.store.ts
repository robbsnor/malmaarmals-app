import { useCloned } from '@vueuse/core';
import { defineStore } from 'pinia';
import { v4 } from 'uuid';
import { ref, toRaw, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { useVideoStore } from './video.store';
import { useVideosStore } from './videos.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { toast } from 'vue-sonner';

export const TIME_PRIOR_OFFSET_S = 2;

export const useManageChaptersStore = defineStore('manage-chapters', () => {
    const videoStore = useVideoStore();
    const videosStore = useVideosStore();
    const playlistsStore = usePlaylistsStore();

    const { cloned: chapters, sync: reset, isModified } = useCloned(() => videoStore.chapters);
    const editMode = ref(false);
    const showDrawer = ref(false);
    const valid = ref(false);
    const loading = ref(false);

    async function addEmptyChapter() {
        const emptyChapter = {
            id: v4(),
            category_id: '',
            end_s: 0,
            start_s: videoStore.currentTimeRounded,
            video_id: videoStore.id,
            category: {
                id: v4(),
                category_id: '',
                image_url: '',
                title: '',
            },
        };
        chapters.value.push(emptyChapter);
    }

    async function discard() {
        reset();
        editMode.value = false;
    }

    async function saveCategories() {
        const categories = chapters.value.map((chapter) => ({
            category_id: chapter.category.category_id,
            title: chapter.category.title,
            image_url: chapter.category.image_url,
        }));

        for (const category of categories) {
            // dont need loop
            const { error } = await supabase.from('categories').upsert(category, { onConflict: 'category_id' });
            if (error) throw error;
        }
    }

    async function deleteExistingChapters() {
        const { error } = await supabase.from('chapters').delete().eq('video_id', videoStore.id);
        if (error) throw error;
    }

    async function saveChapters() {
        chapters.value.sort((a, b) => a.start_s - b.start_s);

        const newChapters = chapters.value.map((chapter, i) => ({
            video_id: videoStore.id,
            category_id: chapter.category.category_id,
            start_s: chapter.start_s,
            end_s:
                i < chapters.value.length - 1 ? chapters.value[i + 1].start_s : Math.floor(videoStore.info.length_sec),
        }));

        const { error } = await supabase.from('chapters').insert(newChapters);
        if (error) throw error;
    }

    const save = async () => {
        loading.value = true;

        await saveCategories();
        await deleteExistingChapters();
        await saveChapters();
        await videosStore.fetchVideos();
        await playlistsStore.fetchPlaylists();
        toast.success('Saved chapters');

        loading.value = false;
        showDrawer.value = false;

        await sleep(500);
        editMode.value = false;
    };

    // sort chapters by start_s
    watch(
        () => chapters.value,
        (newChapters) => {
            if (!newChapters) return;
            newChapters.sort((a, b) => a.start_s - b.start_s);
        },
        { deep: true }
    );

    watch(
        () => videoStore.id,
        () => (editMode.value = false)
    );
    return {
        valid,
        loading,
        chapters,
        isModified,
        editMode,
        showDrawer,

        reset,
        discard,
        addEmptyChapter,
        save,
    };
});
