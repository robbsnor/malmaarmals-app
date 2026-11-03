<script setup lang="ts">
import { ref } from 'vue';
import Drawer from '../../shared/components/Drawer.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ChatSettings from './ChatSettings.vue';
import PlayerButton from './PlayerButton.vue';
import GeneralSettings from './GeneralSettings.vue';
import SettingsHeader from './SettingsHeader.vue';
import StreamSettings from './StreamSettings.vue';
import VolumeControl from './VolumeControl.vue';
import ChaptersSettings from './ChaptersSettings.vue';

const preferenceStore = usePreferenceStore();

const items = [
    {
        title: 'General',
        // icon: 'mdi-cog',
        icon: 'mdi-television',
        component: GeneralSettings,
        window: 'general',
    },
    {
        title: 'Chapters',
        icon: 'mdi-format-list-bulleted',
        component: ChaptersSettings,
        window: 'chapters',
    },
    {
        title: 'Chat (beta)',
        icon: 'mdi-chat-outline',
        component: ChatSettings,
        window: 'chat',
    },
    {
        title: 'Stream behaviour',
        icon: 'mdi-auto-fix',
        component: StreamSettings,
        window: 'stream',
    },
];
</script>

<template>
    <Drawer v-model="preferenceStore.drawer" :eager="true" :padding="false">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-cog-outline" />
        </template>

        <v-window v-model="preferenceStore.activeSettingsTab" :touch="false" class="min-h-88">
            <v-window-item value="home">
                <SettingsHeader title="Preferences" />

                <div class="flex flex-col pt-2">
                    <button
                        v-for="item in items"
                        class="px-5 py-3 hover:bg-black-400 cursor-pointer flex items-center gap-4"
                        @click="preferenceStore.activeSettingsTab = item.window"
                    >
                        <v-icon :icon="item.icon" :size="20"></v-icon>
                        {{ item.title }}
                    </button>
                </div>

                <div class="sm:hidden pl-3 pr-8 pt-2 pb-8 mt-2 rounded-md border-t border-t-black-400">
                    <VolumeControl />
                </div>
            </v-window-item>

            <v-window-item v-for="item in items" :key="item.title" :value="item.window" class="pb-12">
                <SettingsHeader
                    @back="preferenceStore.activeSettingsTab = 'home'"
                    :title="item.title"
                    :icon="item.icon"
                    show-back-icon
                />
                <component :is="item.component" class="p-4" />
            </v-window-item>
        </v-window>
    </Drawer>
</template>
