<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { supabase } from '../../../supabase';
import BottomSheetContainer from '../../shared/components/BottomSheetContainer.vue';
import { useDebounceFn } from '@vueuse/core';
import type { SearchCategory } from '../models/category.model';
import ManageChapterRow from './ManageChapterRow.vue';
import { useVideoStore } from '../stores/video.store';

export interface FormRow {
    startTime?: number;
    category?: SearchCategory;
}

const formDefault = {
    startTime: 0,
    category: null,
};

const videoStore = useVideoStore();
// form doesnt reflect fetched chapters
const valid = ref(false);
const loading = ref(false);

function addChapter() {
    videoStore.chapters.push({
        category_id: null,
        end_s: 0,
        id: '',
        start_s: videoStore.currentTime,
        video_id: videoStore.videoId,
        category: {
            category_id: null,
            id: '',
            image_url: '',
            title: '',
        },
    });

    videoStore.chapters = videoStore.chapters.sort((a, b) => a.start_s - b.start_s);
}

async function saveCategories() {
    const categories = videoStore.chapters.map((chapter) => ({
        category_id: chapter.category.category_id,
        title: chapter.category.title,
        image_url: chapter.category.image_url,
    }));

    console.log(categories);

    for (const category of categories) {
        const { error } = await supabase.from('categories').upsert(category, { onConflict: 'category_id' });
        if (error) throw error;
    }
}

async function deleteExistingChapters() {
    const { error } = await supabase.from('chapters').delete().eq('video_id', videoStore.videoId);
    if (error) throw error;
}

async function saveChapters() {
    const chapters = videoStore.chapters.map((chapter, i) => ({
        video_id: videoStore.videoId,
        category_id: chapter.category.category_id,
        start_s: chapter.start_s,
        end_s:
            i < videoStore.chapters.length - 1
                ? videoStore.chapters[i + 1].start_s
                : Math.floor(videoStore.videoInfo.length_sec),
    }));

    const { error } = await supabase.from('chapters').insert(chapters);
    if (error) throw error;
}

const submit = async () => {
    loading.value = true;

    await saveCategories();
    await deleteExistingChapters();
    await saveChapters();
    await videoStore.fetchChapters();

    loading.value = false;
};
</script>

<template>
    <div v-if="videoStore.videoInfo && videoStore.chapters" class="absolute top-8 right-8 z-60">
        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Add chapters</div>
            <v-form v-model="valid" class="flex flex-col gap-4">
                <ManageChapterRow
                    v-for="(chapter, i) in videoStore.chapters"
                    :key="chapter.start_s"
                    v-model="videoStore.chapters[i]"
                    :i="i"
                />

                <div class="flex justify-center">
                    <v-btn @click="addChapter" color="primary" icon="mdi-plus"> </v-btn>
                </div>

                <div class="flex items-center justify-end gap-4 -mx-4 pt-4 px-4 border-t border-black-500">
                    <v-btn @click="videoStore.resetChaptersForm">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit">Save</v-btn>
                </div>
            </v-form>
        </BottomSheetContainer>
    </div>
</template>
