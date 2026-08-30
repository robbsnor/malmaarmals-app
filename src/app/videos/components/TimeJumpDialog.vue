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
    const total = totalSelectedSeconds.value;
    const safeTotal = Math.min(total, maxSeconds.value);

    if (safeTotal !== total) {
        syncFromTotal(safeTotal);
    }
});

function confirmSelection() {
    const safeValue = Math.min(Math.max(0, totalSelectedSeconds.value), maxSeconds.value);
    videoStore.currentTime = safeValue;
    dialog.value = false;
}
</script>

<template>
    <Dialog
        v-model="dialog"
        title="Jump to time"
        description="Choose a timestamp in this video."
        icon="mdi-clock-time-four-outline"
        width="420"
    >
        <div class="flex items-center justify-center gap-2 py-3 sm:gap-3">
            <TimeWheel v-model="hours" :min="0" :max="Math.floor(maxSeconds / 3600)" label="hr" />
            <div class="text-2xl font-bold text-muted-more">:</div>
            <TimeWheel v-model="minutes" :min="0" :max="59" label="min" />
            <div class="text-2xl font-bold text-muted-more">:</div>
            <TimeWheel v-model="seconds" :min="0" :max="59" label="sec" />
        </div>

        <template #footer>
            <v-btn variant="text" @click="dialog = false">Cancel</v-btn>
            <v-btn color="primary" prepend-icon="mdi-check" @click="confirmSelection">Jump to time</v-btn>
        </template>
    </Dialog>
</template>
