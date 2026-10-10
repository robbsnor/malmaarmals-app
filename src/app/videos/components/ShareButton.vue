<script setup lang="ts">
import { useShare } from '@vueuse/core';
import PlayerButton from './PlayerButton.vue';
import { useVideoStore } from '../stores/video.store';
import { useRoute } from 'vue-router';

const { share, isSupported } = useShare();
const route = useRoute();
const videoStore = useVideoStore();

const dialog = defineModel();

function startShare() {
    share({
        title: `Watch ${videoStore.video.title}`,
        // text: 'on malmaarmals.nl',
        url: location.href,
    });
}
</script>

<template>
    <PlayerButton @click="dialog = true" icon="mdi-share-variant" :size="20" />

    <Dialog v-model="dialog" title="Share" icon="mdi-share-variant">
        <code>
            <pre>
        {{ route }}
    </pre
            >
        </code>
    </Dialog>
</template>
