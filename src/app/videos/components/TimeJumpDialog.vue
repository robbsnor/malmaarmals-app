<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import Dialog from '../../shared/components/Dialog.vue';
import TimeWheel from '../../shared/components/TimeWheel.vue';
import { useVideoStore } from '../stores/video.store';

const dialog = defineModel<boolean>();
const videoStore = useVideoStore();

const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);

const maxSeconds = computed(() => Math.max(0, Math.floor(videoStore.duration || 0)));
const maxHours = computed(() => Math.floor(maxSeconds.value / 3600));
const maxMinutes = computed(() => (hours.value === maxHours.value ? Math.floor((maxSeconds.value % 3600) / 60) : 59));
const maxSelectableSeconds = computed(() =>
    hours.value === maxHours.value && minutes.value === maxMinutes.value ? maxSeconds.value % 60 : 59
);
const totalSelectedSeconds = computed(() => hours.value * 3600 + minutes.value * 60 + seconds.value);

function syncFromTotal(total: number) {
    const safeTotal = Math.min(Math.max(0, Math.floor(total)), maxSeconds.value);
    hours.value = Math.floor(safeTotal / 3600);
    minutes.value = Math.floor((safeTotal % 3600) / 60);
    seconds.value = safeTotal % 60;
}

watch(
    () => dialog.value,
    (isOpen) => {
        if (!isOpen) return;

        syncFromTotal(Math.min(Math.max(0, Math.floor(videoStore.currentTime || 0)), maxSeconds.value));
    },
    { immediate: true }
);

watch([hours, minutes, seconds], () => {
    if (totalSelectedSeconds.value > maxSeconds.value) syncFromTotal(maxSeconds.value);
});

function confirmSelection() {
    videoStore.currentTime = Math.min(totalSelectedSeconds.value, maxSeconds.value);
    dialog.value = false;
}
</script>

<template>
    <Dialog v-model="dialog" title="Jump to time" width="420">
        <div class="flex items-center justify-center gap-2 py-3 sm:gap-3">
            <TimeWheel v-model="hours" :min="0" :max="maxHours" label="hr" />
            <div class="text-2xl font-bold text-muted-more">:</div>
            <TimeWheel v-model="minutes" :min="0" :max="59" :available-max="maxMinutes" label="min" />
            <div class="text-2xl font-bold text-muted-more">:</div>
            <TimeWheel v-model="seconds" :min="0" :max="59" :available-max="maxSelectableSeconds" label="sec" />
        </div>

        <template #footer>
            <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" @click="confirmSelection">Jump to time</v-btn>
        </template>
    </Dialog>
</template>
