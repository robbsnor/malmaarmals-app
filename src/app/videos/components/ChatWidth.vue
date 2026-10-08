<script setup lang="ts">
import { h, ref } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ResetButton from './ResetButton.vue';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <div class=" ">
        <Switch
            text="Overwrite chat width"
            description="Only applies in landscape-mode"
            v-model="preferenceStore.overwriteChatWidth"
        ></Switch>

        <div
            class="relative -4 scale-100 transition-all"
            :class="{ 'pointer-events-none scale-90f!': !preferenceStore.overwriteChatWidth }"
        >
            <div class="flex items-center justify-center -ml-2">
                <v-btn icon="mdi-minus" size="small" variant="text" @click="preferenceStore.chatWidth -= 1"></v-btn>
                <v-slider
                    thumb-size="12"
                    v-model="preferenceStore.chatWidth"
                    track-size="4"
                    density="compact"
                    :max="800"
                    :hide-details="true"
                    :min="100"
                    color="primary"
                    step="1"
                    tick-size="4"
                >
                </v-slider>
                <v-btn icon="mdi-plus" size="small" variant="text" @click="preferenceStore.chatWidth += 1"></v-btn>

                <div class="text-sm font-mono text-muted">{{ preferenceStore.chatWidth }} px</div>
            </div>

            <div
                class="absolute inset-0 bg-linear-to-t from-black-200/90 to-black-200/50 z-10 opacity-0 transition-all pointer-events-none"
                :class="{
                    'opacity-100  ': !preferenceStore.overwriteChatWidth,
                }"
            ></div>
        </div>
    </div>
</template>
