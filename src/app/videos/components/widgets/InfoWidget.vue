<script setup lang="ts">
import { computed, ref } from 'vue';
import Widget from './Widget.vue';
import { BucketHelper } from '../../../shared/helpers/bucket.helper.ts';
import { useVideoStore } from '../../stores/video.store.ts';
import { DateHelper } from '../../../shared/helpers/date.helper.ts';
import { formatDate } from '@vueuse/core';

const videoStore = useVideoStore();

const dateRecorded = computed(() => {
    return new Date(videoStore.video.recorded_at).toLocaleDateString('en-EN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const statTime = computed(() => {
    return new Date(videoStore.video.recorded_at).toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
    });
});

const endTime = computed(() => {
    const startDate = new Date(videoStore.video.recorded_at);
    const endDate = new Date(startDate.getTime() + videoStore.video.length_sec * 1000);
    return endDate.toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
    });
});
</script>

<template>
    <div class="relative rounded-md overflow-hidden">
        <div class="absolute h-40 overflow-hidden flex items-center">
            <img :src="BucketHelper.getThumbnailUrl(videoStore.video.video_id)" alt="" class="w-full aspect-video" />
            <div class="absolute inset-0 bg-linear-to-b from-black/50 to-black"></div>
        </div>

        <div class="relative px-4">
            <div class="pt-12">
                <div class="text-lg font-bold">{{ videoStore.video.title }}</div>
                <div class="text-muted">{{ videoStore.video.description }}</div>
                <div class="text-muted">{{ dateRecorded }}</div>
                <div class="text-muted">{{ statTime }} - {{ endTime }}</div>
            </div>

            <div class="pt-4 text-muted">
                <div class="flex gap-2">
                    <div class="tfext-white">Messages total:</div>
                    <div class="fontf-bold text-primary-light">{{ videoStore.messages.length }}</div>
                </div>
                <div class="flex gap-2">
                    <div class="tfext-white">New subscribers:</div>
                    <div class="fontf-bold text-primary-light">{{ videoStore.subCount }}</div>
                </div>
                <div class="flex gap-2">
                    <div class="tfext-white">Gift-subs:</div>
                    <div class="fontf-bold text-primary-light">{{ videoStore.giftSubs.length }}</div>
                </div>
            </div>
        </div>
    </div>
</template>
