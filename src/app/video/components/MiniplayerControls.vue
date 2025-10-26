<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';
import { RouterLink, useRouter } from 'vue-router';

const videoStore = useVideoStore();
const router = useRouter();
function maximizePlayer() {
    console.log('maximize');
    router.push({ name: 'video', params: { id: videoStore.videoId } });
    videoStore.player.isMini = false;
}
</script>

<template>
    <button
        v-if="videoStore.player.isMini"
        class="absolute inset-0 flex justify-between p-2"
        @click.self="maximizePlayer"
    >
        <v-btn icon @click="videoStore.playing = !videoStore.playing">
            <v-icon
                size="32"
                :icon="videoStore.playing || (!videoStore.playing && videoStore.waiting) ? 'mdi-pause' : 'mdi-play'"
            />
        </v-btn>

        <v-btn icon @click="videoStore.reset">
            <v-icon size="32" icon="mdi-close" />
        </v-btn>
    </button>
</template>
