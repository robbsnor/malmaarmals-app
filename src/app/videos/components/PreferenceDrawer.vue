<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../auth/stores/auth.store.ts';

const preferenceStore = usePreferenceStore();
const authStore = useAuthStore();
const drawer = ref(false);
</script>

<template>
    <Drawer title="Preferences" v-model="drawer">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <Switch
            label="Show floating emotes"
            description="Emotes overlay on video"
            v-model="preferenceStore.showFloatingEmotes"
        />

        <Switch hide-details="auto" label="Facecam" v-model="preferenceStore.showFacecam">
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

        <Switch
            label="Auto Theatre-mode"
            v-model="preferenceStore.autoTheatre"
            description="Go into theatre mode when selecting a stream (video fill height)"
            class="max-md:hidden!"
        />

        <Switch
            label="Auto Fullscreen"
            v-model="preferenceStore.autoFullscreen"
            description="Go into fullscreen mode when selecting a stream"
        />
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
