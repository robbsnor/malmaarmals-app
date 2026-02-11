<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import { Z } from '../../shared/directives/z.directive';

const videoStore = useVideoStore();

const date = computed(() => {
    return new Date(videoStore.info.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
</script>

<template>
    <div
        class="invisible transition-all opacity-0 absolute left-0 right-0 md:hidden shadow-2xl bg-black-200 border-b p-4 border-black-400"
        :class="{ 'visible opacity-100': videoStore.showControllsAndInfo }"
    >
        <div>
            <div class="font-bold text-lg">{{ videoStore.info.title }}</div>
            <div class="text-muted">{{ date }}</div>
        </div>
    </div>
</template>
