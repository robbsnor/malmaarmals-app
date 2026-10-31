<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div class="space-y-2">
        <Switch
            text="Auto Theatre-mode"
            v-model="preferenceStore.autoTheatre"
            description="Go into theatre mode when selecting a stream (video fill height)"
            class="max-lg:hidden!"
        />

        <Switch
            text="Auto Fullscreen"
            v-model="preferenceStore.autoFullscreen"
            description="Go into fullscreen mode when selecting a stream"
        />
    </div>
</template>
