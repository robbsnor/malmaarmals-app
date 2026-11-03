<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div class="space-y-2">
        <Switch
            text="Show Chapters"
            description="Show chapters on timeline and in widgets"
            v-model="preferenceStore.showChaptersGeneral"
        />

        <Switch
            text="Show Chapters for PETER vs TIMON"
            description="Specifically for PETER vs TIMON streams, to prevent spoilers. (not all streams have chapters added yet tho...)"
            v-model="preferenceStore.showChaptersPVT"
            :disabled="!preferenceStore.showChaptersGeneral"
            nested
        />
    </div>
</template>
