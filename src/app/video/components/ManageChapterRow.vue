<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { SearchCategory } from '../models/category.model';
import { useVideoStore } from '../stores/video.store';
import type { ChapterWithCategory } from '../models/chapters-with-category.model';
import type { Tables } from '../../shared/types/database.types';

const chapter = defineModel<ChapterWithCategory>();
const props = defineProps<{ i: number }>();
const videoStore = useVideoStore();
const categories = ref<Tables<'categories'>[]>([]);
const loadingCategories = ref(false);
const deleteDialog = ref(false);
const rules = [
    (value) => {
        if (value || value === 0) return true;
        return 'Field is required.';
    },
];

const fetchTwitchCategories = useDebounceFn(async (e) => {
    if (!e) return;
    if (e.length < 2) return;
    if (e === chapter.value.category?.title) return;

    loadingCategories.value = true;

    const { data, error } = await supabase.functions.invoke<SearchCategory[]>('search-categories', {
        body: { query: e },
    });
    if (error) return console.log(error);

    categories.value = data.map((cat) => ({
        id: 'temp_' + cat.id,
        category_id: cat.id,
        image_url: cat.boxArtUrl,
        title: cat.name,
    }));

    console.log(categories);

    loadingCategories.value = false;
}, 500);

function deleteChapter() {
    videoStore.chapters.splice(props.i, 1);
}

function markStartTime() {
    const currentTime = Math.floor(videoStore.currentTime);

    chapter.value.start_s = currentTime <= 2 ? 0 : currentTime - 2;
}

const prettyTime = computed(() => {
    const totalSeconds = chapter.value.start_s;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const hoursStr = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
    const minutesStr = String(minutes).padStart(2, '0') + ':';
    const secondsStr = String(seconds).padStart(2, '0');

    return hoursStr + minutesStr + secondsStr;
});
</script>

<template>
    <div :class="['flex gap-3', props.i !== videoStore.chapters.length - 1 ? 'border-b border-black-500 pb-4' : '']">
        <div class="h-[56px] aspect-[8/11] bg-black-500 rounded-sm">
            <img
                v-if="chapter.category?.image_url"
                :src="chapter.category.image_url"
                alt=""
                class="h-full rounded-sm"
            />
        </div>

        <v-autocomplete
            @update:search="fetchTwitchCategories"
            label="Category"
            v-model="chapter.category"
            :rules="rules"
            density="default"
            hide-no-data
            hide-details
            autocomplete="off"
            :loading="loadingCategories"
            :items="categories"
            item-title="title"
            return-object
        >
            <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" title="">
                    <div class="flex gap-4 items-center">
                        <img :src="item.raw.image_url" alt="" class="w-10" />
                        <div>{{ item.raw.title }}</div>
                    </div>
                </v-list-item>
            </template>
        </v-autocomplete>

        <div class="flex flex-col justify-between">
            <div class="flex gap-3">
                <v-tooltip location="top" text="Set time (2s before current time)">
                    <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            icon="mdi-target"
                            color="var(--color-black-2000)"
                            @click="markStartTime"
                        />
                    </template>
                </v-tooltip>

                <v-btn
                    icon="mdi-trash-can-outline"
                    variant="tonal"
                    size="x-small"
                    color="error"
                    @click="deleteDialog = true"
                />

                <DeleteDialog
                    v-model="deleteDialog"
                    title="Delete chapter?"
                    description="Are you sure you want to delete this chapter?"
                    @confirm="deleteChapter"
                >
                    <div class="flex items-center gap-2 p-3 bg-black-300 border border-black-600 rounded-md">
                        <img
                            :src="chapter.category.image_url"
                            alt="chapter image"
                            class="inline h-12 mr-2 rounded-md"
                        />
                        <div class="overflow-hidden">
                            <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                            <div class="text-muted text-sm">{{ prettyTime }}</div>
                        </div>
                    </div>
                </DeleteDialog>
            </div>

            <div class="text-muted text-sm leading-none ml-0.5">{{ prettyTime }}</div>
        </div>
    </div>
</template>
