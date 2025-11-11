<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';
import type { Messages } from '../models/messages.model';
import { randomNumber } from '../../shared/helpers/randomNumber';

const videoStore = useVideoStore();
const chatRef = useTemplateRef<HTMLElement>('chatRef');
const renderedMessages = ref<Messages>([]);
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
    if (!chatRef.value) return;
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
    <div
        v-if="videoStore.messages && !videoStore.player.isMini"
        class="bg-red-400f overflow-hidden h-full grow-0 md:w-[250px] lg:w-[350px]"
    >
        <div v-if="!videoStore.messagesLoading" class="h-full py-2">
            <ul ref="chatRef" class="bg-green-800f h-full overflow-auto flex flex-col gap-1 scroll-hidden px-2">
                <Message v-for="message in renderedMessages" :key="message.message_id" :message="message" />
            </ul>
        </div>

        <SkeletonContainer v-else>
            <div class="flex flex-col gap-3 p-2">
                <div v-for="n in 40" :key="n">
                    <Skeleton
                        class="h-6"
                        :style="{
                            width: randomNumber(40, 100) + '%',
                        }"
                    ></Skeleton>
                </div>
            </div>
        </SkeletonContainer>
    </div>
</template>
