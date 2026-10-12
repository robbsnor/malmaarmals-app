<script setup lang="ts">
import { useScroll, useWindowSize } from '@vueuse/core';
import { computed, nextTick, ref, watch, type StyleValue } from 'vue';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { useAppStore } from '../../shared/stores/app.store';
import { CHAT_SIDE, usePreferenceStore } from '../../shared/stores/preference.store';
import { useVideoStore } from '../stores/video.store';
import Message from './Message.vue';

const videoStore = useVideoStore();
const appStore = useAppStore();
const preferenceStore = usePreferenceStore();
const chatRef = ref<HTMLElement>(null);
const userHasScrolledUp = ref(false);
const chatInfoDialog = defineModel();
const { width } = useWindowSize();

const props = defineProps<{ isOverlay?: boolean }>();

const renderedMessages = computed(() => {
    if (videoStore.seeking) return;

    const idx = findLastIndexAtOrBefore(videoStore.currentTimeRounded);
    if (idx === -1) return [];

    const start = Math.max(0, idx - 199);
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

const classes = computed(() => {
    const list: string[] = [];

    if (props.isOverlay) {
        list.push('absolute py-10 h-full top-0 bottom-0 w-60  from-black/40 to-black/0 ');
        if (preferenceStore.chatSide === CHAT_SIDE.LEFT) list.push('left-0 bg-linear-to-r');
        if (preferenceStore.chatSide === CHAT_SIDE.RIGHT) list.push('right-0 bg-linear-to-l');
    } else {
        if (appStore.isLandscape) {
            list.push(
                'relative h-full bg-black-100 w-[250px] shrink-0 bg-black-300 border-black-600 lg:w-[300px] 2xl:w-[400px] 4xl:w-[500px]'
            );

            if (preferenceStore.chatSide === CHAT_SIDE.LEFT) {
                list.push('border-r');
            } else {
                list.push('border-l');
            }
        }
    }

    return list;
});

const styles = computed(() => {
    const list: StyleValue[] = [];

    if (preferenceStore.overwriteChatWidth && appStore.isLandscape) {
        list.push({ width: `${preferenceStore.chatWidth}%` });
    }
    if (props.isOverlay) {
    } else {
    }

    return list;
});
</script>

<template>
    <div v-if="!videoStore.playerIsMini" class="overflow-auto" :class="classes" :style="styles">
        <template v-if="!videoStore.messagesLoading">
            <template v-if="videoStore.messages.length">
                <div v-if="!props.isOverlay" class="absolute top-4 right-4">
                    <v-btn
                        icon="mdi-information-outline"
                        @click="chatInfoDialog = true"
                        size="x-small"
                        variant="tonal"
                        color="grey"
                    >
                    </v-btn>
                </div>

                <Dialog v-model="chatInfoDialog" title="Chat info" icon="mdi-information-outline">
                    <div>
                        <div class="text-muted">
                            Some sub-badges can be behind by a few versions, this is because of an estimated calculation
                            based on your last sub-message. And some sub-badges do not show up because of no recorded
                            data.
                        </div>
                    </div>
                </Dialog>

                <div
                    ref="chatRef"
                    class="scroll-hidden flex h-full flex-col gap-1 overflow-auto p-2 2xl:px-4"
                    @scroll="onScroll"
                >
                    <Message
                        v-for="message in renderedMessages"
                        :key="message.message_id"
                        :message="message"
                        :font-scale="preferenceStore.chatFontScale"
                        :text-shadow="true"
                    />
                </div>

                <v-fade-transition>
                    <div v-if="userHasScrolledUp" class="absolute right-0 bottom-0 pb-4 left-0 flex justify-center">
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
                </v-fade-transition>
            </template>

            <div v-else class="flex h-full items-center justify-center">
                <Empty title="No messages found" description="lekkerAppie" icon="mdi-chat"> </Empty>
            </div>
        </template>

        <div v-else class="flex h-full overflow-hidden flex-col gap-3 p-4">
            <template v-if="!props.isOverlay">
                <div v-for="n in 40" :key="n">
                    <Skeleton
                        class="h-6 bg-black-400 md:bg-black-600"
                        :style="{
                            width: randomNumber(40, 100) + '%',
                        }"
                    ></Skeleton>
                </div>
            </template>
        </div>
    </div>
</template>
