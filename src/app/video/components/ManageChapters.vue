<script setup lang="ts">
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import BottomSheetContainer from '../../shared/components/BottomSheetContainer.vue';
import { useDebounceFn } from '@vueuse/core';
import type { Category } from '../models/category.model';
import ManageChapterRow from './ManageChapterRow.vue';
import { useVideoStore } from '../stores/video.store';

export interface FormRow {
    startTime?: number;
    category?: Category;
}

const videoStore = useVideoStore();
const form = ref<FormRow[]>([
    // {
    //     startTime: 0,
    //     category: null,
    // },
    {
        startTime: 721,
        category: {
            id: '1303814335',
            name: 'Finding Frankie',
            boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/1303814335_IGDB-52x72.jpg',
        },
    },
    {
        startTime: 2862,
        category: {
            id: '15828774',
            name: 'Greyhill Incident',
            boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/15828774_IGDB-52x72.jpg',
        },
    },
    {
        startTime: 5437,
        category: {
            id: '1904996652',
            name: 'Mouthwashing',
            boxArtUrl: 'https://static-cdn.jtvnw.net/ttv-boxart/1904996652_IGDB-52x72.jpg',
        },
    },
]);
const valid = ref(false);
const loading = ref(false);

function addChapter() {
    form.value.push({
        startTime: videoStore.currentTime,
        category: null,
    });
}

async function saveCategories() {
    const categoriesForm = form.value.map((row) => ({
        category_id: row.category.id,
        title: row.category.name,
        image_url: row.category.boxArtUrl,
    }));

    const { error } = await supabase.from('categories').upsert(categoriesForm, { onConflict: 'category_id' });

    if (error) return console.error('Error upserting category:', error);
}

async function deleteExistingChapters() {
    const { error } = await supabase.from('chapters').delete().eq('video_id', videoStore.videoId);

    if (error) return console.error('Error deleting existing chapters:', error);
}

async function saveChapters() {
    const chaptersForm = form.value.map((row, i) => ({
        video_id: videoStore.videoId,
        category_id: row.category?.id,
        start_s: row.startTime,
        end_s: i < form.value.length - 1 ? form.value[i + 1].startTime : Math.floor(videoStore.duration),
    }));

    const { error } = await supabase.from('chapters').insert(chaptersForm);

    if (error) return console.error('Error inserting chapter:', error);
}

const submit = async () => {
    loading.value = true;
    await saveCategories();
    await deleteExistingChapters();
    await saveChapters();

    loading.value = false;
};

function deleteChapter(i: number) {
    form.value.splice(i, 1);
}
</script>

<template>
    <div class="absolute top-8 right-8 z-60">
        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Add chapters</div>
            <v-form v-model="valid" class="flex flex-col gap-4">
                <ManageChapterRow
                    v-for="(row, i) in form"
                    :key="row.startTime"
                    v-model="form[i]"
                    :i="i"
                    @delete="deleteChapter"
                />

                <div class="flex justify-center">
                    <v-btn @click="addChapter" color="primary" icon="mdi-plus"> </v-btn>
                </div>

                <div class="flex items-center justify-end gap-4 -mx-4 pt-4 px-4 border-t border-black-500">
                    <v-btn :disabled="!valid" :loading="loading" @click="submit"> Minimize </v-btn>
                    <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit"> Save </v-btn>
                </div>
            </v-form>
        </BottomSheetContainer>
    </div>
</template>
