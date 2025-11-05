<script setup lang="ts">
import { ref } from 'vue';
import { supabase } from '../../../supabase';
import BottomSheetContainer from '../../shared/components/BottomSheetContainer.vue';
import type { SearchCategory } from '../models/category.model';
import ManageChapterRow from './ManageChapterRow.vue';
import { useVideoStore } from '../stores/video.store';
import { sleep } from '../../shared/helpers/sleep';

export interface FormRow {
    startTime?: number;
    category?: SearchCategory;
}

const videoStore = useVideoStore();
const valid = ref(false);
const loading = ref(false);

function addEmptyChapter() {
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

    await videoStore.fetchChapters();

    loading.value = false;
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
            <v-form v-auto-animate v-model="valid" class="flex flex-col gap-4">
                <ManageChapterRow
                    v-for="(chapter, i) in videoStore.chapters"
                    :key="chapter.start_s"
                    v-model="videoStore.chapters[i]"
                    :i="i"
                />

                <div class="flex justify-center">
                    <v-btn @click="addEmptyChapter" color="primary" icon="mdi-plus"> </v-btn>
                </div>
            </v-form>

            <template #footer>
                <div class="flex items-center justify-end gap-4 -mx-4 pt-4 px-4 border-t border-black-500">
                    <v-btn @click="cancel">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit">Save</v-btn>
                </div>
            </template>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
