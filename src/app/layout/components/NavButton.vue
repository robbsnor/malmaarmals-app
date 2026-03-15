<script setup lang="ts">
const props = defineProps<{ to: any }>();
</script>

<template>
    <RouterLink
        :to="props.to"
        class="group relative h-full flex flex-col justify-center items-center px-4 uppercase font-bold text-primary-light"
    >
        <slot></slot>
        <div
            class="absolute bottom-0 rounded-xl h-1 w-0 bg-primary opacity-0 group-hover:opacity-50 group-hover:w-full transition-all duration-100"
        ></div>
        <div
            class="absolute bottom-0 h-[150%] translate-y-full opacity-0 aspect-square rounded-full bg-primary blur-xl -z-1 pointer-events-none transition-all duration-300 group-hover:translate-y-1/2 group-hover:opacity-60"
        ></div>
    </RouterLink>
</template>
