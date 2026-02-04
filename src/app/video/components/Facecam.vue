<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div
        v-if="preferenceStore.preferences.showFacecam"
        class="aspect-video w-[30%] max-w-60 absolute bottom-2 right-2 overflow-hidden rounded-md shadow-lg bg-black"
    >
        <img src="/images/facecam2.jpg" class="object-fill w-full h-full" alt="Malse Facecam" />
        <a
            class="absolute right-1 bottom-0 text-muted text-xs p-0.5"
            href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
            target="_blank"
        >
            @braxshinoa
        </a>
    </div>
</template>
