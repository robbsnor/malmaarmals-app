<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import { computed, nextTick, onMounted, ref } from 'vue';
import VideoInfo from './VideoInfo.vue';
import { useAppStore } from '../../shared/stores/app.store.ts';
import Widgets from './Widgets.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
const authStore = useAuthStore();

const videoColRef = ref<HTMLElement>();

const containerLayoutClasses = computed(() => {
    if (videoStore.playerIsMini) {
        return 'border-black-500 right-4 bottom-[100px] aspect-video min-w-[200px] w-5/12 overflow-hidden rounded-md border shadow-[0_0_20px_rgba(0,0,0,1)] lg:w-[400px] lg:bottom-8 2xl:right-8';
    }
    if (videoStore.theaterMode) {
        return 'top-0 right-0 bottom-0 left-0';
    }
    return 'top-0 right-0 bottom-0 left-0 lg:top-header';
});

onMounted(async () => {
    await nextTick();
    videoStore.videoColRef = videoColRef.value;
});
</script>

<template>
    <div
        ref="videoContainerRef"
        v-if="videoStore.playerIsActive && authStore.isSubbed"
        class="xxd z-video-container fixed flex flex-col flex-nowrap bg-black"
        :class="[containerLayoutClasses, { 'flex-row': appStore.isLandscape }]"
    >
        <div
            ref="videoColRef"
            class="relative scroll-hidden bg-black-100"
            :class="{ 'w-full overflow-auto': appStore.isLandscape }"
        >
            <div
                ref="containerRef"
                class="max-h-screen overflow-hidden bg-black"
                :class="{
                    'grow overflow-auto': appStore.isLandscape,
                    'h-full': videoStore.theaterMode && appStore.isLandscape,
                }"
            >
                <Player ref="videoRef" />
            </div>

            <Widgets />

            <div class="relative opacity-50">
                <img class="relative left-4 -bottom-4 w-30" src="/images/painted-emotes/lekkerHoor.png" alt="" />
            </div>
        </div>

        <Chat />
    </div>
</template>
