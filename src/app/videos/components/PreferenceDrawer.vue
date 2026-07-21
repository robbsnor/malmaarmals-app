<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';

const preferenceStore = usePreferenceStore();
const drawer = ref(false);
</script>

<template>
    <Drawer title="Preferences" v-model="drawer">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <div class="flex flex-col gap-4">
            <FormGroup title="UI Changes">
                <Switch
                    label="Show Floating-Emotes"
                    description="Emotes overlay on video"
                    v-model="preferenceStore.showFloatingEmotes"
                />

                <Switch
                    label="Show Hype-Graph"
                    description="Adds a graph above the timeline. Spikes are based on chat messages and emotes"
                    v-model="preferenceStore.showHypeGraph"
                />

                <Switch hide-details="auto" label="Show Facecam" v-model="preferenceStore.showFacecam">
                    <template #description>
                        <a
                            class="hover:text-primary inline-block"
                            href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
                            target="_blank"
                        >
                            @braxshinoa - photo credit
                        </a>
                    </template>
                </Switch>
            </FormGroup>

            <FormGroup title="Auto stuff">
                <Switch
                    label="Auto Theatre-mode"
                    v-model="preferenceStore.autoTheatre"
                    description="Go into theatre mode when selecting a stream (video fill height)"
                    class="max-lg:hidden!"
                />

                <Switch
                    label="Auto Fullscreen"
                    v-model="preferenceStore.autoFullscreen"
                    description="Go into fullscreen mode when selecting a stream"
                />
            </FormGroup>
        </div>
    </Drawer>
</template>

<style scoped>
:deep(.v-selection-control) {
    flex-direction: row-reverse;
    justify-content: space-between;
}

:deep(.v-label) {
    padding-inline-start: 0 !important;
    width: 100%;
}
</style>
