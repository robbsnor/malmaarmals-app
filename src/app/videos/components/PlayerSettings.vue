<script setup lang="ts">
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div class="space-y-2">
        <Switch
            text="Show Floating-Emotes"
            description="Emotes overlay on video"
            v-model="preferenceStore.showFloatingEmotes"
        />

        <Switch
            text="Show Hype-Graph"
            description="Adds a graph above the timeline. Spikes are based on chat messages and emotes"
            v-model="preferenceStore.showHypeGraph"
        />

        <Switch hide-details="auto" text="Show Facecam" v-model="preferenceStore.showFacecam">
            <template #description>
                With help from
                <a
                    class="hover:text-primary inline-block underline"
                    href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
                    target="_blank"
                >
                    @braxshinoa
                </a>
            </template>
        </Switch>

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
