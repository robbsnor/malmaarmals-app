<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';
import type { Messages } from '../models/messages.model';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { sleep } from '../../shared/helpers/sleep';

const videoStore = useVideoStore();
const chatRef = useTemplateRef<HTMLElement>('chatRef');
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
    const { scrollTop, scrollHeight, clientHeight } = chatRef.value;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    userHasScrolledUp.value = distanceFromBottom > 200;
}

function scrollBackDown() {
    if (!chatRef.value) return;
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
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
        class="relative bg-orange-400 overflow-auto h-full md:shrink-0 md:w-[250px] md:bg-fuchsia-400 lg:w-[300px] lg:bg-blue-500 xl:w-[400px] xl:bg-red-500 4xl:w-[500px] 4xl:bg-green-500"
    >
        <template v-if="!videoStore.messagesLoading">
            <template v-if="videoStore.messages.length">
                <ul
                    ref="chatRef"
                    class="bg-green-800f h-full overflow-auto flex flex-col gap-1 px-2 py-2 pt-4"
                    @scroll="onScroll"
                >
                    <Message v-for="message in renderedMessages" :key="message.message_id" :message="message" />
                </ul>

                <div v-if="userHasScrolledUp" class="absolute bottom-4 flex justify-center left-0 right-0">
                    <button @click="scrollBackDown()" class="px-4 p-2 bg-sky-400 rounded-md">Scroll back down</button>
                </div>
            </template>

            <div v-else class="h-full flex justify-center items-center">
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
