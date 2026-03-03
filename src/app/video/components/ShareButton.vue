<script setup lang="ts">
import { useShare } from '@vueuse/core';
import PlayerButton from './PlayerButton.vue';
import { useVideoStore } from '../stores/video.store';

const { share, isSupported } = useShare();
const videoStore = useVideoStore();

function startShare() {
    share({
        title: `Watch ${videoStore.info.title}`,
        text: 'on malmaarmals.nl',
        url: location.href,
    });
}
</script>

<template>
    <PlayerButton v-if="isSupported" @click="startShare()" icon="mdi-share-variant" :size="20" />
</template>
