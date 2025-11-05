<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { supabase } from '../../../supabase';
import BottomSheetContainer from '../../shared/components/BottomSheetContainer.vue';
import type { SearchCategory } from '../models/category.model';
import ManageChapterRow from './ManageChapterRow.vue';
import { useVideoStore } from '../stores/video.store';
import { sleep } from '../../shared/helpers/sleep';
import { useAuthStore } from '../../auth/stores/auth.store';

export interface FormRow {
    startTime?: number;
    category?: SearchCategory;
}

const videoStore = useVideoStore();
const authStore = useAuthStore();
const valid = ref(false);
const loading = ref(false);
const resetLoading = ref(false);

async function addEmptyChapter() {
    videoStore.chapters.push({
        category_id: '',
        end_s: 0,
        id: '',
        start_s: Math.floor(videoStore.currentTime),
        video_id: videoStore.videoId,
        category: {
            category_id: '',
            id: '',
            image_url: '',
            title: '',
        },
    });

    await nextTick();
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

    loading.value = false;
    videoStore.showChapterManager = false;

    await videoStore.fetchChapters();
};

async function cancel() {
    resetLoading.value = true;
    await sleep(200);
    videoStore.resetChaptersForm();
    resetLoading.value = false;
}
</script>

<template>
    <v-bottom-sheet v-model="videoStore.showChapterManager" inset>
        <BottomSheetContainer v-if="videoStore.videoInfo && videoStore.chapters" title="Manage chapters">
            <div
                v-if="videoStore.chapters.length"
                class="overflow-auto overflow-x-hidden scroll-hiddenf max-h-[50vh] p-4"
            >
                <v-form v-model="valid" class="flex flex-col gap-4">
                    <ManageChapterRow
                        v-for="(chapter, i) in videoStore.chapters"
                        :key="chapter.start_s"
                        v-model="videoStore.chapters[i]"
                        :i="i"
                    />
                </v-form>
            </div>

            <Empty
                v-else
                title="No chapters..."
                description="Add your first chapter to get started!"
                icon="mdi-format-list-bulleted"
                class="p-4"
            >
                <v-btn @click="addEmptyChapter" color="primary" variant="tonal" prepend-icon="mdi-plus">
                    Add chapter
                </v-btn>
            </Empty>

            <template #actions>
                <v-btn
                    v-if="videoStore.chapters.length"
                    @click="addEmptyChapter"
                    color="primary"
                    size="small"
                    variant="tonal"
                    prepend-icon="mdi-plus"
                >
                    Add chapter
                </v-btn>
            </template>

            <template v-if="videoStore.chapters.length" #footer>
                <div class="flex items-center justify-end gap-4">
                    <v-btn :loading="resetLoading" @click="cancel">Reset</v-btn>
                    <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit">Save</v-btn>
                </div>
            </template>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
