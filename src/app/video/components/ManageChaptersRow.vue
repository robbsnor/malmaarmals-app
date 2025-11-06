<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { SearchCategory } from '../models/category.model';
import { useVideoStore } from '../stores/video.store';
import type { ChapterWithCategory } from '../models/chapters-with-category.model';
import type { Tables } from '../../shared/models/database.types';
import { BABBELEN_CATEGORY, INTRO_CATEGORY } from '../data/chapters.data';
import { prettyTime } from '../../shared/helpers/prettyTime';
import CategoryThumbnail from './CategoryThumbnail.vue';

const chapter = defineModel<ChapterWithCategory>();
const props = defineProps<{ i: number }>();
const videoStore = useVideoStore();
const categories = ref<Tables<'categories'>[]>([]);
const loadingCategories = ref(false);
const rules = [
    (value) => {
        if (value || value === 0) return true;
        return 'Field is required.';
    },
];

onMounted(() => {
    updateCategories();
});

const updateCategories = useDebounceFn(async (query?: string) => {
    if (!query) {
        categories.value = [INTRO_CATEGORY, BABBELEN_CATEGORY];
        return;
    }

    if (query.length < 2) return;
    if (query === chapter.value.category?.title) return;

    loadingCategories.value = true;

    const { data, error } = await supabase.functions.invoke<SearchCategory[]>('search-categories', {
        body: { query: query },
    });
    if (error) return console.log(error);

    categories.value = data.map((cat) => ({
        id: 'temp_' + cat.id,
        category_id: cat.id,
        image_url: cat.boxArtUrl,
        title: cat.name,
    }));

    loadingCategories.value = false;
}, 500);

function deleteChapter() {
    videoStore.chapters.splice(props.i, 1);
}

function markStartTime() {
    chapter.value.start_s = Math.floor(videoStore.currentTime);
}

const prettyTimeComputed = computed(() => prettyTime(chapter.value.start_s));
</script>

<template>
    <div :class="['flex gap-3', props.i !== videoStore.chapters.length - 1 ? 'border-b border-black-500 pb-4' : '']">
        <CategoryThumbnail :category="chapter.category" />

        <v-autocomplete
            @update:search="updateCategories"
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
                <!-- <v-btn
                    icon="mdi-play"
                    variant="tonal"
                    size="x-small"
                    color="var(--color-black-2000)"
                    @click="videoStore.currentTime = chapter.start_s"
                /> -->

                <ConfirmDialog @confirm="markStartTime" title="Change chapter time?" width="unset">
                    <template #activator="{ props }">
                        <v-btn
                            v-bind="props"
                            size="x-small"
                            variant="tonal"
                            icon="mdi-target"
                            color="var(--color-black-2000)"
                            @click="videoStore.playing = false"
                        />
                    </template>

                    <div class="flex items-center gap-4">
                        <CategoryThumbnail :category="chapter.category" class="h-[83px]" />

                        <div class="overflow-hidden">
                            <div class="font-bold text-muted mb-1">{{ chapter.category.title }}</div>
                            <div
                                class="inline-flex items-center gap-4 py-2 px-4 rounded-md bg-black-200 border border-black-500"
                            >
                                <div class="text-muted">{{ prettyTimeComputed }}</div>
                                <v-icon icon="mdi-chevron-right" color="var(--color-muted)" />
                                <div class="text-primary">{{ prettyTime(videoStore.currentTime) }}</div>
                            </div>
                        </div>
                    </div>
                </ConfirmDialog>

                <v-menu location="top start">
                    <template v-slot:activator="{ props }">
                        <v-btn
                            size="x-small"
                            variant="tonal"
                            icon="mdi-dots-vertical"
                            color="var(--color-black-2000)"
                            v-bind="props"
                        />
                    </template>

                    <v-list>
                        <v-list-item prepend-icon="mdi-play" @click="videoStore.currentTime = chapter.start_s">
                            <v-list-item-title>Go to: {{ prettyTimeComputed }} </v-list-item-title>
                        </v-list-item>

                        <DeleteDialog
                            title="Delete chapter?"
                            description="Are you sure you want to delete this chapter?"
                            @confirm="deleteChapter"
                        >
                            <template #activator="{ props }">
                                <v-list-item v-bind="props" prepend-icon="mdi-trash-can-outline">
                                    <v-list-item-title>Delete Chapter</v-list-item-title>
                                </v-list-item>
                            </template>

                            <div class="flex items-center gap-2 p-3 bg-black-300 border border-black-600 rounded-md">
                                <img
                                    :src="chapter.category.image_url"
                                    alt="chapter image"
                                    class="inline h-12 mr-2 rounded-md"
                                />
                                <div class="overflow-hidden">
                                    <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                                    <div class="text-muted text-sm">{{ prettyTimeComputed }}</div>
                                </div>
                            </div>
                        </DeleteDialog>
                    </v-list>
                </v-menu>
            </div>

            <div class="text-muted text-sm leading-none ml-0.5">{{ prettyTimeComputed }}</div>
        </div>
    </div>
</template>
