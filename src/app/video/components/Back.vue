<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useVideoStore } from '../stores/video.store';

const router = useRouter();
const videoStore = useVideoStore();
</script>

<template>
    <button
        @click="router.push('/videos')"
        class="invisible -translate-y-2 transition-all opacity-0 absolute top-2 left-2 p-1 rounded-md bg-black/25 cursor-pointer hover:bg-black/70 lg:hidden"
        :class="{ 'visible translate-y-0 opacity-100': videoStore.showInfo }"
    >
        <v-icon>mdi-chevron-left</v-icon>
    </button>
</template>
