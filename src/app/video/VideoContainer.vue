<script setup lang="ts">
import { useAppStore } from '../shared/stores/app.store';
import Player from './components/Player.vue';
import Chat from './components/Chat.vue';
import Info from './components/Info.vue';
import InfoLarge from './components/InfoLarge.vue';
import { useVideoStore } from './stores/video.store';

const appStore = useAppStore();
const videoStore = useVideoStore();
</script>

<template>
    <div
        v-if="appStore.player.isActive"
        class="fixed bg-black z-100 flex flex-col md:flex-row"
        :class="
            appStore.player.isMini
                ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0'
        "
    >
        <div class="md:overflow-auto md:scroll-hidden">
            <Player />
            <!-- <Info /> -->
            <!-- <InfoLarge /> -->
        </div>

        <Chat class="shrink-0 w-full md:w-[280px]" />
    </div>
</template>
