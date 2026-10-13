<script setup lang="ts">
import Drawer from '../../shared/components/Drawer.vue';
import { CHAT_SIDE, usePreferenceStore } from '../../shared/stores/preference.store';
import ChatWidthSetting from './ChatWidthSetting.vue';
import FontScaleSetting from './FontScaleSetting.vue';
import PlayerButton from './PlayerButton.vue';
import VolumeControl from './VolumeControl.vue';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <Drawer v-model="preferenceStore.drawer">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <div class="space-y-4 pb-12">
            <div class="sm:hidden px-1 pr-4 py-0.5 rounded-md bg-black-400 border border-black-500">
                <VolumeControl />
            </div>

            <div class="space-y-10">
                <div class="space-y-3">
                    <FormHeader title="Chat"></FormHeader>
                    <FontScaleSetting />
                    <ChatWidthSetting />

                    <div class="flex justify-between items-center gap-4">
                        <FormLabel description="Display chat on left or right side of stream">Chat side</FormLabel>
                        <v-btn-toggle
                            v-model="preferenceStore.chatSide"
                            color="deep-purple-accent-3"
                            density="compact"
                            class="shrink-0"
                            group
                        >
                            <v-btn :value="CHAT_SIDE.LEFT"> Left </v-btn>
                            <v-btn :value="CHAT_SIDE.RIGHT"> Right </v-btn>
                        </v-btn-toggle>
                    </div>
                </div>

                <div class="space-y-2">
                    <FormHeader title="Player"></FormHeader>

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

                <div class="space-y-2">
                    <FormHeader title="Stream behaviour"></FormHeader>

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
        </div>
    </Drawer>
</template>
