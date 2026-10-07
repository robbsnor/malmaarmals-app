<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { ArrayHelper } from '../../shared/helpers/array.helper.ts';

const preferenceStore = usePreferenceStore();
const fontSizes = ref([14, 16, 18, 20]);
const labels = computed(() => fontSizes.value.map((v) => `${v}px`));
const selectedTick = ref(0);

function setFontSize(i: number) {
    preferenceStore.chatFontSize = fontSizes.value[i];
}

function syncSelectedTick() {
    selectedTick.value = fontSizes.value.findIndex((size) => size === preferenceStore.chatFontSize);
}

function reset() {
    console.log('vddd reset');
    preferenceStore.chatFontSize = 14;
    syncSelectedTick();
}

defineExpose({
    syncSelectedTick,
});
</script>

<template>
    <div>
        <div class="flex justify-between items-center">
            <FormLabel class="-mb-3 relative z-1">Chat fontsize</FormLabel>
            <v-icon
                icon="mdi-refresh"
                class="text-muted-more! p-2.5 rounded-full transition-colors hover:bg-black-600"
                size="xsmall"
                @click="reset"
            ></v-icon>
        </div>

        <v-slider
            thumb-size="12"
            v-model="selectedTick"
            track-size="4"
            density="compact"
            :max="3"
            color="primary"
            :ticks="ArrayHelper.arrayToIndexedObject(labels)"
            show-ticks="always"
            step="1"
            tick-size="4"
            @update:model-value="setFontSize"
        ></v-slider>
    </div>
</template>
