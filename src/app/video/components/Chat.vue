<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const chatRef = useTemplateRef<HTMLElement>('chatRef');

const renderedMessages = computed(() => {
    // Find the index of the last message within videoTime using binary search
    let left = 0;
    let right = videoStore.messages.length - 1;
    let idx = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (videoStore.messages[mid].offset_sec <= videoStore.currentTime) {
            idx = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (idx === -1) return [];

    // Return up to 400 messages ending at idx
    const start = Math.max(0, idx - 399);
    return videoStore.messages.slice(start, idx + 1);
});

// watchEffect(async () => {
//     videoStore.currentTime; // Depend on videoTime
//     await nextTick();
//     chatRef.value.scrollTop = chatRef.value.scrollHeight;
// });
</script>

<template>
    <ul
        v-if="videoStore.messages"
        ref="chatRef"
        class="flex flex-col gap-1 p-4 overflow-y-auto overflow-x-hidden h-full w-full self-stretch scroll-hidden md:pr-2 lg:p-4"
    >
        <Message v-for="message in renderedMessages" :key="message.id" :message="message" />
    </ul>
</template>
