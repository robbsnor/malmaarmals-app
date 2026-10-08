<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store.ts';
import { ArrayHelper } from '../../shared/helpers/array.helper.ts';

const preferenceStore = usePreferenceStore();
const defaultFontScale = 1;
const fontScales = ref([0.8, defaultFontScale, 1.2, 1.4, 1.6]);
const labels = computed(() => fontScales.value.map((v) => `${v * 100}%`));
const selectedTick = ref(0);

function setFontScale(index: number) {
    preferenceStore.chatFontScale = fontScales.value[index];
}

function syncSelectedTick() {
    selectedTick.value = fontScales.value.findIndex((size) => size === preferenceStore.chatFontScale);
}

function reset() {
    preferenceStore.chatFontScale = defaultFontScale;
}

watch(
    () => preferenceStore.chatFontScale,
    () => syncSelectedTick(),
    { immediate: true }
);
</script>

<template>
    <div>
        <div class="flex justify-between items-center">
            <FormLabel class="-mb-3 relative z-1">Message size</FormLabel>
            <v-icon
                v-visible="preferenceStore.chatFontScale !== selectedTick"
                icon="mdi-refresh"
                class="text-muted-more! p-2.5 relative z-10 rounded-full transition-colors hover:bg-black-600"
                size="xsmall"
                @click="reset"
            ></v-icon>
        </div>

        <v-slider
            thumb-size="12"
            v-model="selectedTick"
            track-size="4"
            density="compact"
            :max="fontScales.length - 1"
            color="primary"
            :ticks="ArrayHelper.arrayToIndexedObject(labels)"
            show-ticks="always"
            step="1"
            tick-size="4"
            @update:model-value="setFontScale"
        ></v-slider>
    </div>
</template>

<style scoped>
:deep(.v-input) {
    margin-left: 2px;
    margin-right: 2px;
}
</style>
