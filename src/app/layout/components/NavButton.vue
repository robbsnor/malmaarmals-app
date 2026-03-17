<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = defineProps<{ to: RouteLocationRaw }>();
</script>

<template>
    <RouterLink
        :to="props.to"
        active-class="is-active"
        class="group relative flex h-full flex-col items-center justify-center px-4 font-bold uppercase text-muted transition-colors [&.is-active]:text-primary-light"
    >
        <slot></slot>

        <div
            class="absolute bottom-0 h-0.5 w-0 rounded-xl bg-primary opacity-0 transition-all duration-100 group-hover:w-4 group-hover:opacity-50 in-[.is-active]:!w-full in-[.is-active]:!opacity-100"
        ></div>

        <div
            class="pointer-events-none absolute bottom-0 -z-1 aspect-square h-[100%] translate-y-full rounded-full bg-primary opacity-0 blur-xl transition-all duration-300 group-hover:translate-y-2/3 group-hover:opacity-30 in-[.is-active]:!translate-y-1/2 in-[.is-active]:!opacity-60"
        ></div>
    </RouterLink>
</template>
