<script setup lang="ts">
import { twMerge, twJoin } from 'tailwind-merge';
import { computed } from 'vue';
import type { VideoProgression } from '../../video/models/VideoProgression.model';

const props = withDefaults(
    defineProps<{
        src: string;
        icon?: string;
        iconSize?: string | number;
        type?: 'large';
        videoId?: number;
    }>(),
    {
        icon: '$play',
        iconSize: 40,
    }
);

const time = computed(() => {
    return JSON.parse(localStorage.getItem(props.videoId?.toString())) as VideoProgression;
});
</script>

<template>
    <div
        :class="
            twMerge(
                'videothumbnail relative transition-all block group overflow-hidden rounded-md aspect-video self-start',
                props.type === 'large' && 'rounded-2xl'
            )
        "
    >
        <v-img :src="props.src" class="relative w-full group-hover:scale-102f transition-all" aria-hidden="true" />
        <div
            class="absolute z-10 top-0 right-0 bottom-0 left-0 bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 foo transition-all duration-200 flex justify-center items-center"
        >
            <v-icon :icon="props.icon" :size="props.iconSize" />
        </div>

        <slot></slot>

        <div
            v-if="time && time.percentage < 95 && time.percentage > 5"
            class="absolute bottom-0 right-0 left-0 h-1 bg-black-400"
        >
            <div class="bg-primary h-full" :style="{ width: `${time.percentage}%` }"></div>
        </div>
    </div>
</template>
