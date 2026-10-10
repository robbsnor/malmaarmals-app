<script setup lang="ts">
import { h, ref } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ResetButton from './ResetButton.vue';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div>
        <Switch
            text="Overwrite chat width"
            description="Only applies in landscape-mode"
            v-model="preferenceStore.overwriteChatWidth"
        ></Switch>

        <div
            class="relative -4 transition-all"
            :class="{ 'pointer-events-none opacity-50': !preferenceStore.overwriteChatWidth }"
        >
            <div class="flex items-center justify-center -ml-2">
                <v-btn icon="mdi-minus" size="small" variant="text" @click="preferenceStore.chatWidth -= 0.1"></v-btn>
                <v-slider
                    :disabled="!preferenceStore.overwriteChatWidth"
                    thumb-size="12"
                    v-model="preferenceStore.chatWidth"
                    track-size="4"
                    density="compact"
                    :max="50"
                    :hide-details="true"
                    :min="10"
                    color="primary"
                    step=".1"
                    tick-size="4"
                >
                </v-slider>
                <v-btn icon="mdi-plus" size="small" variant="text" @click="preferenceStore.chatWidth += 0.1"></v-btn>

                <div class="text-sm font-mono text-muted">{{ preferenceStore.chatWidth.toFixed(2) }}%</div>
            </div>
        </div>
    </div>
</template>
