<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div v-if="preferenceStore.showFacecam" class="flex absolute inset-0 items-center justify-center">
        <div class="w-full h-full flex items-end justify-end p-4">
            <div class="relative aspect-video overflow-hidden rounded-md shadow-lg bg-black w-[30%] max-w-60">
                <img src="/images/facecam2.jpg" class="object-fill w-full h-full" alt="Malse Facecam" />
            </div>
        </div>
    </div>
</template>
