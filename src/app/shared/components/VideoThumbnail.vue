<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        src: string;
        to: string;
        icon?: string;
        iconSize?: string;
    }>(),
    {
        icon: 'i-lucide-play',
        iconSize: 'size-8',
    }
);
</script>

<template>
    <RouterLink :to="props.to" class="relative transition-all duration-200 group">
        <img :src="props.src" class="relative mb-2 aspect-video w-full rounded-md" aria-hidden="true" />
        <slot></slot>
        <div
            class="absolute inset-0 bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 transition-all duration-200 flex justify-center items-center"
        >
            <UIcon :name="props.icon" :class="props.iconSize" />
        </div>
    </RouterLink>
</template>
