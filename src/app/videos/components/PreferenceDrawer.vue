<script setup lang="ts">
import { ref } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ChatSettings from './ChatSettings.vue';
import PlayerButton from './PlayerButton.vue';
import PlayerSettings from './PlayerSettings.vue';
import SettingsHeader from './SettingsHeader.vue';
import StreamSettings from './StreamSettings.vue';
import VolumeControl from './VolumeControl.vue';

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

        <v-window v-model="window" :touch="false" class="min-h-75">
            <v-window-item value="home">
                <SettingsHeader title="Preferences" />

                <div class="flex flex-col pt-2">
                    <button
                        v-for="item in items"
                        class="px-5 py-3 hover:bg-black-400 cursor-pointer flex items-center gap-4"
                        @click="window = item.value"
                    >
                        <v-icon :icon="item.icon" :size="20"></v-icon>
                        {{ item.title }}
                    </button>
                </div>

                <div class="sm:hidden px-1 pr-4 py-0.5 m-4 mt-4 rounded-md bg-black-400 border border-black-500">
                    <VolumeControl />
                </div>
            </v-window-item>

            <v-window-item v-for="item in items" :key="item.title" :value="item.value" class="pb-12">
                <SettingsHeader @back="window = 'home'" :title="item.title" :icon="item.icon" show-back-icon />
                <component :is="item.component" class="p-4" />
            </v-window-item>
        </v-window>
    </Drawer>
</template>
