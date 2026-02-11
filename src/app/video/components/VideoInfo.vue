<script setup lang="ts">
import { computed } from 'vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();

const date = computed(() => {
    return new Date(videoStore.videoInfo.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
</script>

<template>
    <div class="bg-red-300 min-h-[84px] flex justify-between gap-4 bg-black-200f border-bf p-4 border-black-400">
        <template v-if="videoStore.videoInfo">
            <div>
                <div class="font-bold text-lg">{{ videoStore.videoInfo.title }}</div>
                <div class="text-muted">{{ date }}</div>
            </div>
            <div class="md:hidden! transition-all" :class="{ 'rotate-180': videoStore.showExtraInfoMobile }">
                <v-btn
                    variant="text"
                    @click="videoStore.showExtraInfoMobile = !videoStore.showExtraInfoMobile"
                    icon="mdi-chevron-down"
                ></v-btn>
            </div>
        </template>
    </div>
</template>
