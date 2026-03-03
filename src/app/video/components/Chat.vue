<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';
import type { Messages } from '../models/messages.model';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { sleep } from '../../shared/helpers/sleep';
import { useScroll } from '@vueuse/core';

const videoStore = useVideoStore();
const chatRef = ref<HTMLElement>(null);
const userHasScrolledUp = ref(false);

const renderedMessages = computed<Messages>(() => {
    const idx = findLastIndexAtOrBefore(videoStore.currentTimeRounded);
    if (idx === -1) return [];
    const start = Math.max(0, idx - 399);
    return videoStore.messages.slice(start, idx + 1);
});

function findLastIndexAtOrBefore(sec: number): number {
    const msgs = videoStore.messages;
    let left = 0;
    let right = msgs.length - 1;
    let idx = -1;

    while (left <= right) {
        const mid = (left + right) >>> 1;
        if (msgs[mid].offset_sec <= sec) {
            idx = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return idx;
}

function onScroll() {
    if (!chatRef.value) return;

    const { y } = useScroll(chatRef);
    const { scrollHeight, clientHeight } = chatRef.value;
    const distanceFromBottom = scrollHeight - y.value - clientHeight;

    userHasScrolledUp.value = distanceFromBottom > 100;
}

function scrollBackDown() {
    if (!chatRef.value) return;

    const { y } = useScroll(chatRef, { behavior: 'smooth' });
    y.value = chatRef.value.scrollHeight;

    userHasScrolledUp.value = false;
}

watch(renderedMessages, async () => {
    if (!chatRef.value) return;
    if (userHasScrolledUp.value) return;
    await nextTick();
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
});
</script>

<template>
    <div
        v-if="!videoStore.playerIsMini"
        :class="videoStore.showChat ? 'md:block' : 'md:hidden'"
        class="relative h-full overflow-auto bg-black-100 md:bg-black-300 md:border-l md:border-black-600 md:bg-fuchsia-400f lg:bg-blue-500f xl:bg-red-500f 4xl:w-[500px] 4xl:bg-green-500f md:w-[250px] md:shrink-0 lg:w-[300px] xl:w-[400px]"
    >
        <template v-if="!videoStore.messagesLoading">
            <template v-if="videoStore.messages.length">
                <ul
                    ref="chatRef"
                    class="bg-green-800f max-lg:scroll-hidden flex h-full flex-col gap-1 overflow-auto px-2 py-2 pt-4 2xl:px-4"
                    @scroll="onScroll"
                >
                    <Message v-for="message in renderedMessages" :key="message.message_id" :message="message" />
                </ul>

                <div v-visible="userHasScrolledUp" class="absolute right-0 bottom-0 pb-4 left-0 flex justify-center">
                    <div
                        class="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none select-none bg-linear-to-b to-primary/20"
                    ></div>
                    <button
                        @click="scrollBackDown()"
                        class="bg-primary relative flex items-center gap-1 rounded-md p-2 px-4 text-sm font-bold transition-all"
                    >
                        <v-icon icon="mdi-arrow-down"></v-icon>
                        <div class="-mt-[1px] pl-1 pr-2">New messages</div>
                    </button>
                </div>
            </template>

            <div v-else class="flex h-full items-center justify-center">
                <Empty title="No messages found" description="lekkerAppie" icon="mdi-chat">
                    <!-- <v-btn color="primary" variant="tonal">submit messages</v-btn> -->
                </Empty>
            </div>
        </template>

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
