<script setup lang="ts">
import { ref } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import { CHAT_SIDE, usePreferenceStore } from '../../shared/stores/preference.store';
import ChatWidthSetting from './ChatWidthSetting.vue';
import FontScaleSetting from './FontScaleSetting.vue';
import PlayerButton from './PlayerButton.vue';
import VolumeControl from './VolumeControl.vue';
import SettingsHeader from './SettingsHeader.vue';
import ChatSettings from './ChatSettings.vue';
import PlayerSettings from './PlayerSettings.vue';
import StreamSettings from './StreamSettings.vue';

const preferenceStore = usePreferenceStore();

const items = [
    {
        title: 'Chat (beta)',
        icon: 'mdi-chat',
        component: ChatSettings,
        value: 'chat',
    },
    {
        title: 'Player',
        icon: 'mdi-television',
        component: PlayerSettings,
        value: 'player',
    },
    {
        title: 'Stream behaviour',
        icon: 'mdi-auto-fix',
        component: StreamSettings,
        value: 'stream',
    },
];

const window = ref<'home' | 'chat' | 'player' | 'stream' | string>('home');
</script>

<template>
    <Drawer v-model="preferenceStore.drawer" :eager="true" :padding="false">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <v-window v-model="window" class="min-h-60" :touch="false">
            <v-window-item value="home">
                <!-- <div class="sm:hidden px-1 pr-4 py-0.5 rounded-md bg-black-400 border border-black-500">
                    <VolumeControl />
                </div> -->

                <div class="px-4 py-3 border-b border-black-500">
                    <h3 class="font-bold text-xl">Preferences</h3>
                </div>

                <div class="flex flex-col py-2">
                    <button
                        v-for="item in items"
                        class="px-5 py-3 hover:bg-black-400 cursor-pointer flex items-center gap-4"
                        @click="window = item.value"
                    >
                        <v-icon :icon="item.icon" :size="20"></v-icon>
                        {{ item.title }}
                    </button>
                </div>
            </v-window-item>

            <v-window-item v-for="item in items" :key="item.title" :value="item.value" class="p-4 pb-12">
                <SettingsHeader @back="window = 'home'" :title="item.title" class="mb-4" :icon="item.icon" />
                <component :is="item.component" />
            </v-window-item>
        </v-window>
    </Drawer>
</template>
