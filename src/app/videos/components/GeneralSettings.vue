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
    </div>
</template>
