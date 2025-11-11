<script setup lang="ts">
import { useAppStore } from '../../shared/stores/app.store';
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import Info from './Info.vue';
import InfoLarge from './InfoLarge.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <div
        v-if="videoStore.player.isActive && authStore.canWatch"
        class="fixed bg-black z-50 flex flex-col md:flex-row"
        :class="
            videoStore.player.isMini
                ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0'
        "
    >
        <div class="md:overflow-auto md:scroll-hidden w-full aspect-video">
            <template v-if="!videoStore.videoInfoLoading && !!videoStore.videoInfo">
                <Player />
                <Info />
                <InfoLarge />
            </template>

            <SkeletonContainer v-else class="p-2">
                <Skeleton :pulse="false" class="h-full w-full" />
            </SkeletonContainer>
        </div>

        <Chat />
    </div>
</template>
