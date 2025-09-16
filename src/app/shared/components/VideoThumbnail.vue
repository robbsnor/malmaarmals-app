<script setup lang="ts">
import { twMerge, twJoin } from 'tailwind-merge';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        src: string;
        to: string;
        icon?: string;
        iconSize?: string | number;
        type?: 'large';
    }>(),
    {
        icon: '$play',
        iconSize: 40,
    }
);
</script>

<template>
    <RouterLink
        :to="props.to"
        :class="
            twMerge(
                'videothumbnail relative transition-all block group overflow-hidden rounded-md',
                props.type === 'large' && 'rounded-2xl'
            )
        "
    >
        <img
            :src="props.src"
            class="relative aspect-video w-full group-hover:scale-102 transition-all"
            aria-hidden="true"
        />
        <div
            class="absolute z-10 top-0 right-0 bottom-0 left-0 bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 foo transition-all duration-200 flex justify-center items-center"
        >
            <v-icon :icon="props.icon" :size="props.iconSize" />
        </div>

        <slot></slot>
    </RouterLink>
</template>
