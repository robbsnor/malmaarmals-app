<script setup lang="ts">
import { computed, ref } from 'vue';
import Widget from './Widget.vue';
import { BucketHelper } from '../../../shared/helpers/bucket.helper.ts';
import { useVideoStore } from '../../stores/video.store.ts';
import { DateHelper } from '../../../shared/helpers/date.helper.ts';
import { formatDate } from '@vueuse/core';
import { NumberHelper } from '../../../shared/helpers/number.helper.ts';

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

const topChatters = computed(() => {
    const counts = new Map<number, { userId: number; userName: string; count: number; color: string }>();

    for (const msg of videoStore.messages) {
        const existing = counts.get(msg.user_id);
        if (existing) {
            existing.count++;
        } else {
            counts.set(msg.user_id, { userId: msg.user_id, userName: msg.user_name, count: 1, color: msg.user_color });
        }
    }

    return [...counts.values()].sort((a, b) => b.count - a.count);
});
</script>

<template>
    <div class="@container relative rounded-md overflow-hidden">
        <div class="absolute h-full overflow-hidden flex items-center">
            <img :src="BucketHelper.getThumbnailUrl(videoStore.video.video_id)" alt="" class="w-full" />
            <div class="absolute inset-0 bg-linear-to-b from-black-100/80 to-black-100"></div>
        </div>

        <div class="relative p-4 pb-6">
            <div class="grid grid-cols-2 gap-4 @xl:grid-cols-4">
                <div
                    v-for="stat in [
                        {
                            title: 'Messages',
                            value: NumberHelper.formatWithDots(videoStore.messages.length),
                        },
                        {
                            title: 'Chatters',
                            value: NumberHelper.formatWithDots(topChatters.length),
                        },
                        {
                            title: 'New subs',
                            value: `~${NumberHelper.formatWithDots(videoStore.subCount)}`,
                        },
                        {
                            title: 'Gift-subs',
                            value: `~${NumberHelper.formatWithDots(videoStore.giftSubs.length)}`,
                        },
                    ]"
                >
                    <div class="text-muted">{{ stat.title }}:</div>
                    <div class="font-bold">
                        {{ videoStore.messagesLoading ? '...' : stat.value }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
