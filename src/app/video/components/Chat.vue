<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const chatRef = useTemplateRef<HTMLElement>('chatRef');
const renderedMessages = ref<Tables<'messages'>[]>([]);
const prevTime = ref(0);

const setRenderedMessages = (sec: number) => {
    // Find the index of the last message within videoTime using binary search
    let left = 0;
    let right = videoStore.messages.length - 1;
    let idx = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (videoStore.messages[mid].offset_sec <= sec) {
            idx = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (idx === -1) return [];

    // Return up to 400 messages ending at idx
    const start = Math.max(0, idx - 399);
    renderedMessages.value = videoStore.messages.slice(start, idx + 1);
};

const scrollToBottom = async () => {
    await nextTick();
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
};

watch(
    () => videoStore.currentTime,
    async (newTime) => {
        if (Math.abs(newTime - prevTime.value) < 1) return;
        newTime = Math.floor(newTime);
        prevTime.value = newTime;

        setRenderedMessages(newTime);
        await scrollToBottom();
    }
);
</script>

<template>
    <ul
        v-if="videoStore.messages"
        ref="chatRef"
        class="flex flex-col gap-1 px-2 overflow-y-auto overflow-x-hidden h-full w-full self-stretch scroll-hidden md:pr-2 lg:p-4"
    >
        <Message v-for="message in renderedMessages" :key="message.id" :message="message" />
    </ul>
</template>
