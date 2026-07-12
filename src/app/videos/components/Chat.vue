<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { useScroll, useWindowSize } from '@vueuse/core';
import Message from './Message.vue';
import { useAppStore } from '../../shared/stores/app.store.ts';

const videoStore = useVideoStore();
const appStore = useAppStore();
const chatRef = ref<HTMLElement>(null);
const userHasScrolledUp = ref(false);
const chatInfoDialog = defineModel();
const { width } = useWindowSize();

const renderedMessages = computed(() => {
    if (videoStore.seeking) return;

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

    const { y } = useScroll(chatRef);
    y.value = chatRef.value.scrollHeight;

    userHasScrolledUp.value = false;
}

watch(renderedMessages, async () => {
    if (!chatRef.value) return;
    if (userHasScrolledUp.value) return;
    await nextTick();
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
});

watch(width, () => {
    scrollBackDown();
});
</script>

<template>
    <div
        v-if="!videoStore.playerIsMini && (videoStore.showChat || !appStore.isLandscape)"
        class="fffa relative h-full overflow-auto bg-black-100"
        :class="{
            'w-[250px] shrink-0 bg-black-300 border-l border-black-600 lg:w-[300px] 2xl:w-[400px] 4xl:w-[500px]':
                appStore.isLandscape,
        }"
    >
        <template v-if="!videoStore.messagesLoading">
            <template v-if="videoStore.messages.length">
                <div class="absolute top-4 right-4">
                    <v-btn
                        icon="mdi-help-circle-outline"
                        @click="chatInfoDialog = true"
                        size="x-small"
                        variant="tonal"
                        color="grey"
                    >
                    </v-btn>
                </div>

                <Dialog v-model="chatInfoDialog" title="Chat info" icon="mdi-help-circle-outline">
                    <div>
                        <div class="font-bold">Q: Why do I not see my sub-badge?</div>
                        <div class="text-muted">
                            A: Not all users that should have a sub-badge, have one displayed. Even on the original
                            stream replay they are missing. My guess is that Prime subs don't get saved on Twitch VOD's
                        </div>
                    </div>
                </Dialog>

                <div
                    ref="chatRef"
                    class="bg-green-800f scroll-hidden flex h-full flex-col gap-1 overflow-auto px-2 py-2 pt-4 2xl:px-4"
                    @scroll="onScroll"
                >
                    <Message v-for="message in renderedMessages" :key="message.message_id" :message="message" />
                </div>

                <div v-visible="userHasScrolledUp" class="absolute right-0 bottom-0 pb-4 left-0 flex justify-center">
                    <div
                        class="absolute bottom-0 left-0 right-0 h-[120px] pointer-events-none select-none bg-linear-to-b to-primary/20"
                    ></div>
                    <button
                        @click="scrollBackDown()"
                        class="bg-primary relative flex items-center gap-1 rounded-md p-2 px-4 text-sm font-bold transition-all"
                    >
                        <v-icon icon="mdi-arrow-down"></v-icon>
                        <div class="-mt-[1px] pl-1 pr-2">Resume</div>
                    </button>
                </div>
            </template>

            <div v-else class="flex h-full items-center justify-center">
                <Empty title="No messages found" description="lekkerAppie" icon="mdi-chat"> </Empty>
            </div>
        </template>

        <div v-else class="flex h-full overflow-hidden flex-col gap-3 p-2">
            <div v-for="n in 40" :key="n">
                <Skeleton
                    class="h-6 bg-black-400 md:bg-black-600"
                    :style="{
                        width: randomNumber(40, 100) + '%',
                    }"
                ></Skeleton>
            </div>
        </div>
    </div>
</template>
