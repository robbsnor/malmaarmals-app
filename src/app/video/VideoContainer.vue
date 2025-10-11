<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '../shared/stores/app.store';
import Player from './components/Player.vue';

const appStore = useAppStore();
</script>

<template>
    <div
        v-if="appStore.player.isActive"
        class="fixed bg-black-200 z-100"
        :class="
            appStore.player.isMini
                ? 'right-4 bottom-[100px] aspect-video h-[120px] rounded-md overflow-hidden border  border-black-500  shadow-[0_0_20px_rgba(0,0,0,1)]'
                : 'top-0 right-0 bottom-0 left-0'
        "
    >
        <div>
            <Player />
        </div>
    </div>
</template>
