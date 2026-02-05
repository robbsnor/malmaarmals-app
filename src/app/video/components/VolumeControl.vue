<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';

const videoStore = useVideoStore();
</script>

<template>
    <div class="hidden md:flex items-center justify-centers gap-2">
        <PlayerButton
            :icon="videoStore.muted ? 'mdi-volume-off' : 'mdi-volume-high'"
            @click="videoStore.muted = !videoStore.muted"
        ></PlayerButton>

        <v-slider
            v-model="videoStore.volume"
            hide-details="auto"
            thumb-size="12"
            track-size="4"
            color="primary"
            class="w-25 mx-0! mt-0.5"
            :class="{ 'opacity-50': videoStore.muted }"
            :max="1"
            :min="0"
            :step="0.01"
        />
    </div>
</template>
