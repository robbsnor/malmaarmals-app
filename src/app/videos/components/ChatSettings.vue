<script setup lang="ts">
import { CHAT_SIDE, usePreferenceStore } from '../../shared/stores/preference.store';
import ChatWidthSetting from './ChatWidthSetting.vue';
import FontScaleSetting from './FontScaleSetting.vue';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div class="space-y-3">
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
</template>
