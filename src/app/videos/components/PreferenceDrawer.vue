<script setup lang="ts">
import { ref } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import PlayerButton from './PlayerButton.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import VolumeControl from './VolumeControl.vue';
import FontScale from './FontScale.vue';
import ChatWidth from './ChatWidth.vue';

const preferenceStore = usePreferenceStore();
const drawer = ref(false);
</script>

<template>
    <Drawer v-model="drawer">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <div class="flex flex-col gap-6 pb-6">
            <div class="sm:hidden px-1 pr-4 py-0.5 rounded-md bg-black-400 border border-black-500">
                <VolumeControl />
            </div>

            <div class="space-y-2">
                <FormHeader>Player</FormHeader>

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
                        <a
                            class="hover:text-primary inline-block"
                            href="https://www.reddit.com/r/lekkerspelen/comments/1lhp8vc/peter_koopt_een_spijkerbroek/"
                            target="_blank"
                        >
                            @braxshinoa - photo credit
                        </a>
                    </template>
                </Switch>
            </div>

            <div class="space-y-2">
                <FormHeader>Chat</FormHeader>
                <FontScale />
                <ChatWidth />
            </div>

            <div class="space-y-2">
                <FormHeader>Stream behaviour</FormHeader>

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
        </div>
    </Drawer>
</template>
