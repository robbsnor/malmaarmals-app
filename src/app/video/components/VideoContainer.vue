<script setup lang="ts">
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import Info from './Info.vue';
import { Z } from '../../shared/directives/z.directive';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <div
        v-if="videoStore.player.isActive && authStore.isSubbed"
        class="fixed bg-black flex flex-col md:flex-row flex-nowrap"
        v-z="Z.VIDEO_CONTAINER"
        :class="
            videoStore.player.isMini
                ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0'
        "
    >
        <div class="w-full md:overflow-auto md:scroll-hidden">
            <template v-if="!videoStore.videoInfoLoading && !!videoStore.videoInfo">
                <Player />
                <Info />
            </template>

            <div v-else class="p-2 md:h-full">
                <Skeleton class="aspect-video md:aspect-auto h-full w-full" />
            </div>
        </div>

        <Chat />
    </div>
</template>
