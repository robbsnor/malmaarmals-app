<script setup lang="ts">
import { twMerge } from 'tailwind-merge';

const props = withDefaults(
    defineProps<{
        title?: string;
        showTopFade?: boolean;
        showTopStroke?: boolean;
        viewMore?: boolean;
        size?: 'large';
    }>(),
    {
        showTopFade: true,
        showTopStroke: true,
        viewMore: true,
    }
);
</script>

<template>
    <section :class="twMerge('relative py-12 md:py-20 overflow-hidden', props.size === 'large' && 'py-20 xl:py-40')">
        <div class="absolute inset-0 overflow-hidden">
            <slot name="background" />
        </div>

        <div
            v-if="props.showTopFade"
            class="absolute top-0 h-150 w-full left-1/2 -translate-x-1/2"
            style="
                background: radial-gradient(farthest-side at top center, var(--color-black-300), transparent);
                /* background: linear-gradient(to bottom, var(--color-black-200), transparent); */
            "
        ></div>

        <div
            v-if="props.showTopFade && props.showTopStroke"
            class="absolute top-0 left-0 right-0 h-[1px] bg-radial from-black-800 to-transparent"
        ></div>

        <Container class="relative z-10">
            <div v-if="props.title" class="flex justify-between items-end pb-4">
                <h2 class="text-4xl font-bold">
                    {{ props.title }}
                </h2>

                <v-btn v-if="props.viewMore" to="/videos" variant="text">view all</v-btn>
            </div>

            <slot />
        </Container>
    </section>
</template>
