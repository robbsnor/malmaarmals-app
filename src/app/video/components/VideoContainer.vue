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
    <div v-if="videoStore.player.isActive && authStore.canWatch">
        <div
            class="fixed bg-black z-100 flex flex-col md:flex-row"
            :class="
                videoStore.player.isMini
                    ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                    : 'top-0 right-0 bottom-0 left-0'
            "
        >
            <div v-if="!!videoStore.videoInfo" class="md:overflow-auto md:scroll-hidden">
                <Player />
                <Info />
                <InfoLarge v-if="!videoStore.player.isMini" />
            </div>

            <Chat v-if="!videoStore.player.isMini" class="shrink-0 w-full md:w-[250px]" />
        </div>
    </div>
</template>
