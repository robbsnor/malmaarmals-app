<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title?: string;
        showTopFade?: boolean;
        showTopStroke?: boolean;
    }>(),
    {
        showTopFade: true,
        showTopStroke: true,
    }
);
</script>

<template>
    <section class="relative overflow-hidden">
        <Container class="relative z-10 py-12 md:py-20">
            <Stroke v-if="props.showTopFade && props.showTopStroke" class="absolute top-0 left-0 right-0"></Stroke>
            <div v-if="props.title" class="flex justify-between items-end pb-4">
                <h2 class="text-4xl font-bold">
                    {{ props.title }}
                </h2>

                <div>
                    <slot name="actions" />
                </div>
            </div>

            <slot />
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
