<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();

const date = computed(() => {
    return new Date(videoStore.videoInfo.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

const prettyTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    const parts = [];
    if (hrs > 0) parts.push(hrs);
    parts.push(hrs > 0 ? String(mins).padStart(2, '0') : mins);
    parts.push(String(secs).padStart(2, '0'));

    return parts.join(':');
};
</script>

<template>
    <div
        class="invisible transition-all opacity-0 absolute z-10 left-0 right-0 md:hidden shadow-2xl bg-black-200 border-b p-4 border-black-400"
        :class="{ 'visible  opacity-100': videoStore.showControllsAndInfo }"
    >
        <div>
            <div class="font-bold text-lg">{{ videoStore.videoInfo.title }}</div>
            <div class="text-muted">{{ date }}</div>
        </div>
    </div>
</template>
