<script setup lang="ts">
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const props = withDefaults(
    defineProps<{
        title?: string;
        moreLink?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    }>(),
    {}
);
</script>

<template>
    <section class="relative overflow-hidden py-4 border-b border-black-500">
        <Container class="relative">
            <h2 v-if="props.title" class="text-2xl font-bold pb-2">
                {{ props.title }}
            </h2>

            <slot></slot>

            <div v-if="props.moreLink" class="flex gap-4 items-center pt-4">
                <div class="h-[1px] bg-black-400f grow"></div>
                <RouterLink :to="props.moreLink" class="flex gap-1 text-primary">
                    show more
                    <v-icon icon="mdi-chevron-right" />
                </RouterLink>
                <div class="h-[1px] bg-black-400f grow"></div>
            </div>
        </Container>

        <!-- <div
            v-if="props.showTopFade"
            class="absolute top-0 h-150 w-full left-1/2 -translate-x-1/2 pointer-events-none"
            style="
                background: radial-gradient(farthest-side at top center, var(--color-black-300), transparent);
                /* background: linear-gradient(to bottom, var(--color-black-200), transparent); */
            "
        ></div> -->
    </section>
</template>
