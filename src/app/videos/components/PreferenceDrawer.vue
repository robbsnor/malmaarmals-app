<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { storeToRefs } from 'pinia';

const preferenceStore = usePreferenceStore();
const drawer = ref(false);
</script>

<template>
    <Drawer title="Preferences" v-model="drawer">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <v-form>
            <v-switch
                hide-details="auto"
                label="Show floating emoji's"
                density="comfortable"
                v-model="preferenceStore.showFloatingEmotes"
            />

            <div class="relative">
                <v-switch
                    hide-details="auto"
                    label="Facecam"
                    details="foofof"
                    density="comfortable"
                    v-model="preferenceStore.showFacecam"
                />
                <a
                    class="absolute -bottom-[1px] text-muted hover:text-primary text-xs inline-block"
                    href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
                    target="_blank"
                >
                    @braxshinoa - photo credit
                </a>
            </div>
        </v-form>
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
