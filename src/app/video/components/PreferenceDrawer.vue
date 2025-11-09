<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { storeToRefs } from 'pinia';

const preferenceStore = usePreferenceStore();
const { preferences } = storeToRefs(preferenceStore);
const drawer = ref(false);
</script>

<template>
    <Auth>
        <Drawer title="Preferences" v-model="drawer">
            <template #activator="{ props }">
                <PlayerButton v-bind="props" icon="mdi-cog-outline" />
            </template>

            <v-form>
                <v-switch
                    hide-details="auto"
                    label="Show chapters"
                    density="comfortable"
                    v-model="preferences.showChapters"
                />
                <div class="flex gap-4 ml-2">
                    <div class="mt-1.5 text-(--color-muted-more)">
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M1 1V10C1 12.2091 2.79086 14 5 14H14"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                            />
                        </svg>
                    </div>

                    <div class="grow">
                        <v-switch
                            hide-details="auto"
                            label="In PETER vs TIMON"
                            density="comfortable"
                            :disabled="preferenceStore.peterVsTimonDisabled"
                            v-model="preferences.showChaptersPeterVsTimon"
                        />
                    </div>
                </div>

                <v-switch hide-details="auto" label="Facecam" density="comfortable" v-model="preferences.showFacecam" />
            </v-form>
        </Drawer>
    </Auth>
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
