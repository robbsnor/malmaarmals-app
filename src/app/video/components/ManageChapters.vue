<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { supabase } from '../../../supabase';
import ManageChaptersRow from './ManageChaptersRow.vue';
import { useVideoStore } from '../stores/video.store';
import { sleep } from '../../shared/helpers/sleep';
import ChapterControlls from './ChapterControlls.vue';
import { v4 } from 'uuid';

const emits = defineEmits<{
    (e: 'add-chapter'): void;
}>();
const videoStore = useVideoStore();
const valid = ref(false);
const loading = ref(false);
const resetLoading = ref(false);

async function addEmptyChapter() {
    const emptyChapter = {
        id: v4(),
        category_id: '',
        end_s: 0,
        start_s: videoStore.currentTimeRounded,
        video_id: videoStore.videoId,
        category: {
            id: v4(),
            category_id: '',
            image_url: '',
            title: '',
        },
    };
    videoStore.chapters.push(emptyChapter);
}

async function saveCategories() {
    const categories = videoStore.chapters.map((chapter) => ({
        category_id: chapter.category.category_id,
        title: chapter.category.title,
        image_url: chapter.category.image_url,
    }));

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
    videoStore.chapters.sort((a, b) => a.start_s - b.start_s);

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

const save = async () => {
    loading.value = true;

    await saveCategories();
    await deleteExistingChapters();
    await saveChapters();
    await videoStore.fetchChapters();

    loading.value = false;
    videoStore.showChapterDrawer = false;

    await sleep(500);
    videoStore.editMode = false;
};

async function cancel() {
    videoStore.resetChaptersForm();
    videoStore.editMode = false;
}
</script>

<template>
    <div>
        <template v-if="videoStore.chapters?.length">
            <div>
                <v-form v-model="valid" v-auto-animate class="flex flex-col gap-4">
                    <ManageChaptersRow
                        v-for="(chapter, i) in videoStore.chapters"
                        :key="chapter.id"
                        v-model="videoStore.chapters[i]"
                        :i="i"
                    />
                </v-form>
            </div>

            <div class="mt-6">
                <v-btn @click="addEmptyChapter" variant="tonal" class="w-full" color="primary">Add Chapter</v-btn>
            </div>
        </template>

        <Empty
            v-else
            title="No chapters..."
            description="Add your first chapter to get started!"
            icon="mdi-format-list-bulleted"
        >
            <div class="flex flex-col gap-4">
                <v-btn @click="addEmptyChapter" color="primary" prepend-icon="mdi-plus">Add chapters</v-btn>
            </div>
        </Empty>

        <div v-if="videoStore.chapters.length" class="border-b border-black-500 p-4 pt-0 mb-4 -mx-4">
            <ChapterControlls />
        </div>

        <div class="flex justify-between items-center gap-4">
            <div>
                <div v-if="videoStore.hasChapterChanges" class="text-muted-more underline italic text-sm">
                    Unsaved changes
                </div>
            </div>

            <div class="flex items-center justify-between gap-4">
                <v-btn variant="text" :loading="resetLoading" @click="cancel"> Cancel </v-btn>

                <v-btn color="primary" @click="save" :loading="loading" :disabled="!videoStore.hasChapterChanges">
                    Save
                </v-btn>
            </div>
        </div>
    </div>
</template>
