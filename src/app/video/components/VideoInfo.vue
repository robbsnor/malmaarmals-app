<script setup lang="ts">
import { computed } from 'vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();

const date = computed(() => {
    return new Date(videoStore.info.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});
</script>

<template>
    <div
        class="bg-black-100/80 backdrop-blur-[100px] border-black-400 flex min-h-[84px] justify-between gap-4 border-b p-4 lg:px-8"
    >
        <template v-if="videoStore.info">
            <div>
                <div class="text-lg font-bold">{{ videoStore.info.title }}</div>
                <div class="text-muted">{{ date }}</div>
            </div>
            <!-- <div class="md:hidden! transition-all" :class="{ 'rotate-180': videoStore.showExtraInfoMobile }">
                <v-btn
                    variant="text"
                    @click="videoStore.showExtraInfoMobile = !videoStore.showExtraInfoMobile"
                    icon="mdi-chevron-down"
                ></v-btn>
            </div> -->
        </template>
    </div>
</template>
