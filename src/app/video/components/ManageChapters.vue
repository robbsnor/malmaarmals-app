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

async function addEmptyChapter() {
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
    videoStore.resetChaptersForm();
    await sleep(500);
    videoStore.showChapterManager = false;
}
</script>

<template>
    <v-bottom-sheet v-model="videoStore.showChapterManager" inset>
        <BottomSheetContainer v-if="videoStore.videoInfo && videoStore.chapters" title="Manage chapters">
            <div class="overflow-auto overflow-x-hidden scroll-hiddenf max-h-[50vh] px-4 py-8">
                <v-form v-auto-animate v-model="valid" class="flex flex-col gap-8">
                    <ManageChapterRow
                        v-for="(chapter, i) in videoStore.chapters"
                        :key="chapter.start_s"
                        v-model="videoStore.chapters[i]"
                        :i="i"
                    />
                </v-form>
            </div>

            <template #actions>
                <v-btn @click="addEmptyChapter" color="primary" size="c-small" icon="mdi-plus" />
            </template>

            <template #footer>
                <div class="flex items-center justify-end gap-4">
                    <v-btn @click="cancel">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit">Save</v-btn>
                </div>
            </template>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
