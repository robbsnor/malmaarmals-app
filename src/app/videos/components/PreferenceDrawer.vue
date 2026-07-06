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

        <FormGroup>
            <Switch label="Show floating emoji's" v-model="preferenceStore.showFloatingEmotes" />

            <Switch
                hide-details="auto"
                label="Facecam"
                details="foofof"
                density="comfortable"
                v-model="preferenceStore.showFacecam"
            >
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

        <FormGroup title="Auto stuff" v-if="authStore.isAdmin" class="pt-4">
            <Switch
                label="Auto Theather-mode"
                v-model="preferenceStore.autoTheatre"
                description="Go into theatre mode when selecting a stream"
            />
            <Switch
                label="Auto Fullscreen"
                v-model="preferenceStore.autoFullscreen"
                description="Go into fullscreen mode when selecting a stream"
            />
        </FormGroup>
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
