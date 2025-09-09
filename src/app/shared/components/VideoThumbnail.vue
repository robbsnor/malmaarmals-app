<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        src: string;
        to: string;
        icon?: string;
        iconSize?: string;
        borderRadius?: string;
    }>(),
    {
        icon: 'i-lucide-play',
        iconSize: 'size-8',
        borderRadius: 'rounded-md',
    }
);
</script>

<template>
    <RouterLink
        :to="props.to"
        class="tits relative transition-all block duration-200 group overflow-hidden"
        :class="props.borderRadius"
    >
        <img :src="props.src" class="relative aspect-video w-full" aria-hidden="true" />
        <div
            class="absolute z-10 top-0 right-0 bottom-0 left-0 bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 foo transition-all duration-200 flex justify-center items-center"
        >
            <!-- <UIcon :name="props.icon" :class="props.iconSize" /> -->
        </div>
        <slot></slot>
    </RouterLink>
</template>
