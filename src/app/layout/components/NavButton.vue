<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ to: RouteLocationRaw }>();
</script>

<template>
    <RouterLink
        :to="props.to"
        active-class="is-active"
        class="group relative h-full flex flex-col justify-center items-center px-4 transition-colors uppercase font-bold text-muted [&.is-active]:text-primary-light"
    >
        <slot></slot>

        <div
            class="absolute bottom-0 rounded-xl h-1 bg-primary transition-all duration-100 w-0 opacity-0 group-hover:opacity-50 group-hover:w-4 in-[.is-active]:opacity-100! in-[.is-active]:w-full!"
        ></div>

        <div
            class="absolute bottom-0 h-[150%] aspect-square rounded-full bg-primary blur-xl -z-1 pointer-events-none transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-2/3 group-hover:opacity-30 in-[.is-active]:!translate-y-1/2 in-[.is-active]:!opacity-60"
        ></div>
    </RouterLink>
</template>
