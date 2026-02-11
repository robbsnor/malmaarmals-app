<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue';
import Message from './Message.vue';
import { useVideoStore } from '../stores/video.store';
import type { Messages } from '../models/messages.model';
import { randomNumber } from '../../shared/helpers/randomNumber';
import { Z } from '../../shared/directives/z.directive';

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
        v-if="!videoStore.playerIsMini"
        :class="videoStore.showChat ? 'md:block' : 'md:hidden'"
        class="bg-orange-400 overflow-auto md:shrink-0 md:w-[250px] lg:w-[300px] lg:bg-blue-500 xl:w-[400px] xl:bg-red-500 4xl:w-[500px] 4xl:bg-green-500"
    >
        <div v-if="!videoStore.messagesLoading" class="h-full">
            <ul
                v-if="videoStore.messages.length"
                ref="chatRef"
                class="bg-green-800f h-full overflow-auto flex flex-col gap-1 px-2 py-2 pt-4"
            >
                <Message v-for="message in renderedMessages" :key="message.message_id" :message="message" />
                <!-- <div v-for="n in 100" :key="n">{{ n }} werweyruiweyruweh</div> -->
            </ul>

            <div v-else class="h-full flex justify-center items-center">
                <Empty title="No messages found" description="lekkerAppie" icon="mdi-chat">
                    <v-btn color="primary" variant="tonal">submit messages</v-btn>
                </Empty>
            </div>
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
