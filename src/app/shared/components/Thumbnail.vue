<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        src: string;
        icon?: string;
        iconSize?: string | number;
    }>(),
    {
        icon: '$play',
        iconSize: 60,
    }
);
</script>

<template>
    <div class="relative self-start group overflow-hidden rounded-md hover:scale-104 transition-all">
        <v-img
            :src="props.src"
            class="relative w-full aspect-video group-hover:scale-104 transition-all bg-black-600"
            aria-hidden="true"
        />

        <slot></slot>

        <div
            class="absolute z-9 top-0 right-0 bottom-0 left-0 bg-black/0 opacity-0 group-hover:bg-black/50 group-hover:opacity-100 transition-all duration-200 flex justify-center items-center"
        >
            <v-icon :icon="props.icon" :size="props.iconSize" class="scale-60 group-hover:scale-100 transition-all" />
        </div>
    </div>
</template>
