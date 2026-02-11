<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import Info from './Info.vue';
import { Z } from '../../shared/directives/z.directive';
import { computed, nextTick, ref, useTemplateRef, watch, type StyleValue } from 'vue';
import { useElementSize, useTransition } from '@vueuse/core';
import { sleep } from '../../shared/helpers/sleep';
import { useWindowSize } from '@vueuse/core';
import VideoInfo from './VideoInfo.vue';
import { useDisplay } from 'vuetify';
import ExtraInfoItem from './ExtraInfoItem.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
const { xs } = useDisplay();

const containerRef = useTemplateRef<HTMLElement>('containerRef');
const videoRef = useTemplateRef<HTMLElement>('videoRef');
const infoRef = useTemplateRef<HTMLElement>('infoRef');

const { width: containerWidth, height: containerHeight } = useElementSize(containerRef);
const { width: videoWidth, height: videoHeight } = useElementSize(videoRef);
const { width: infoWidth, height: infoHeight } = useElementSize(infoRef);
const { width: windowWidth, height: windowHeight } = useWindowSize();

const isMaxHeight = computed(() => containerHeight.value + infoHeight.value >= windowHeight.value);
const containerMaxHeight = computed(() => windowHeight.value - infoHeight.value);

const topChattersLength = ref(25);

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

const myStats = computed(() => {
    const index = topChatters.value.findIndex((c) => c.userId === authStore.twitchUserId);
    return index === -1 ? null : { ...topChatters.value[index], rank: index + 1 };
});
</script>

<template>
    <div
        v-if="videoStore.playerIsActive && authStore.isSubbed"
        class="fixed bg-black flex flex-col md:flex-row flex-nowrap"
        v-z="Z.VIDEO_CONTAINER"
        :class="
            videoStore.playerIsMini
                ? 'right-4 bottom-[100px] w-[200px] lg:w-[350px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0 '
        "
    >
        <div class="md:overflow-auto md:grow scroll-hidden">
            <div
                ref="containerRef"
                class="md:flex md:items-center md:justify-center overflow-hidden max-h-screen"
                :class="videoStore.theaterMode ? 'md:h-full' : ''"
            >
                <Player ref="videoRef" />
            </div>

            <template v-if="!videoStore.playerIsMini">
                <!-- info -->
                <VideoInfo :class="videoStore.theaterMode ? 'md:hidden' : 'md:block'" class=" "></VideoInfo>

                <div
                    :class="
                        videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0 pointer-events-none'
                    "
                    class="max-md:absolute max-md:overflow-auto w-full bg-black-300 transition-opacity grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 p-4"
                >
                    <ExtraInfoItem title="Top Chatters">
                        <template #actions>
                            <div class="text-muted-more">{{ videoStore.messages.length }}</div>
                        </template>
                        <div
                            v-for="(chatter, i) in topChatters.slice(0, topChattersLength)"
                            :key="chatter.userName"
                            class="flex justify-between"
                        >
                            <div>
                                <span class="text-muted font-bold">{{ i + 1 }}. </span>
                                <span class="font-bold" :style="{ color: chatter.color }"
                                    >{{ chatter.userName }}:
                                </span>
                            </div>

                            <span>{{ chatter.count }}</span>
                        </div>
                        <template v-if="myStats && myStats.rank > topChattersLength">
                            <div class="h-[1px] bg-black-300 my-1"></div>
                            <div class="flex justify-between">
                                <div>
                                    <span>{{ myStats.rank }}. </span>
                                    <span class="font-bold" :style="{ color: myStats.color }"
                                        >{{ myStats.userName }}:
                                    </span>
                                </div>

                                <span>{{ myStats.count }}</span>
                            </div>
                        </template>
                    </ExtraInfoItem>
                </div>

                <!-- <div
                    :class="
                        videoStore.showExtraInfoMobile ? 'max-md:opacity-100' : 'max-md:opacity-0 pointer-events-none'
                    "
                    class="max-md:absolute max-md:overflow-auto w-full bg-black-300 transition-opacity"
                >
                    <div class="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 p-4">
                        <div v-for="n in 100" :key="n" class="aspect-video bg-black-200 rounded"></div>
                    </div>
                </div> -->
            </template>
        </div>

        <Chat />
    </div>
</template>
