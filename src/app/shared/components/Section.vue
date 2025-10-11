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
    <section class="relative overflow-hidden py-6 border-bf border-black-500">
        <Container class="relative">
            <h2 v-if="props.title" class="text-2xl font-bold pb-2">
                {{ props.title }}
            </h2>

            <slot></slot>

            <div v-if="props.moreLink" class="flex gap-4 items-center pt-4">
                <div class="h-[1px] bg-black-400 grow"></div>
                <RouterLink :to="props.moreLink" class="flex items-center gap-1 text-primary">
                    view more
                    <v-icon size="x-small" icon="mdi-chevron-right" class="mt-[3px]" />
                </RouterLink>
                <div class="h-[1px] bg-black-400 grow"></div>
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
