<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';
import { RouterLink } from 'vue-router';

const videoStore = useVideoStore();
function maximizePlayer() {
    videoStore.player.isMini = false;
}
</script>

<template>
    <RouterLink
        v-if="videoStore.player.isMini"
        :to="{ name: 'video', params: { id: videoStore.videoId } }"
        class="absolute inset-0 flex justify-between p-2"
        @click="maximizePlayer"
    >
        <!-- <v-icon
            @click.stop="videoStore.playing = !videoStore.playing"
            size="20"
            :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
        />

        <v-icon @click="appStore.player.isActive = false" icon="mdi-close" size="20" /> -->
    </RouterLink>
</template>
