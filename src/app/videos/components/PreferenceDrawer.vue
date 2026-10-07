<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import VolumeControl from './VolumeControl.vue';
import FontSize from './FontSize.vue';

const preferenceStore = usePreferenceStore();
const drawer = ref(false);
const fontSizeEl = ref<InstanceType<typeof FontSize>>();

async function onOpen() {
    await nextTick();
    fontSizeEl.value.syncSelectedTick();
}
</script>

<template>
    <Drawer v-model="drawer" @open="onOpen">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <div class="flex flex-col gap-2">
            <div class="sm:hidden px-1 pr-3 rounded-md bg-black-400 border border-black-500">
                <VolumeControl />
            </div>

            <div>
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
            </div>

            <FontSize ref="fontSizeEl" />
        </div>
    </Drawer>
</template>
