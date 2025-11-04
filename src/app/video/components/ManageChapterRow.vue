<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Category } from '../models/category.model';
import type { FormRow } from './ManageChapters.vue';
import { useVideoStore } from '../stores/video.store';

const row = defineModel<FormRow>();
const props = defineProps<{ i: number }>();

const emits = defineEmits<{
    (e: 'delete', value: number): void;
}>();

const videoStore = useVideoStore();
const categories = ref<Category[]>([]);
const rules = [
    (value) => {
        if (value || value === 0) return true;
        return 'Field is required.';
    },
];
const loadingCategories = ref(false);
const fetchTwitchCategories = useDebounceFn(async (e) => {
    if (!e) return;
    if (e.length < 2) return;
    if (e === row.value.category?.name) return;

    loadingCategories.value = true;

    const { data, error } = await supabase.functions.invoke<Category[]>('search-categories', {
        body: { query: e },
    });
    if (error) return console.log(error);

    categories.value = data;
    loadingCategories.value = false;
}, 500);
</script>

<template>
    <div class="flex gap-4 items-center">
        <div class="w-50">
            <v-number-input
                v-model="row.startTime"
                :rules="rules"
                :reverse="false"
                controlVariant="stacked"
                label="Start time (s)"
                :hideInput="false"
                :inset="false"
                append-icon="mdi-target"
                @click:append="row.startTime = Math.floor(videoStore.currentTime)"
            />
        </div>

        <v-autocomplete
            @update:search="fetchTwitchCategories"
            label="Category"
            class="w-100"
            v-model="row.category"
            :rules="rules"
            hide-no-data
            hide-details
            autocomplete="off"
            :loading="loadingCategories"
            :items="categories"
            item-title="name"
            return-object
        >
            <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" title="">
                    <div class="flex gap-4 items-center">
                        <img :src="item.raw.boxArtUrl" alt="" class="w-10" />
                        <div>{{ item.raw.name }}</div>
                    </div>
                </v-list-item>
            </template>
        </v-autocomplete>

        <div class="w-9 h-12 bg-black-500 rounded-sm">
            <img v-if="row.category?.boxArtUrl" :src="row.category.boxArtUrl" alt="" class="h-full rounded-sm" />
        </div>

        <v-btn
            icon="mdi-trash-can-outline"
            variant="tonal"
            size="small"
            color="error"
            @click="emits('delete', props.i)"
        ></v-btn>
    </div>
</template>
