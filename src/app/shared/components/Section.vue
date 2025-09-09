<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title?: string;
        showTopFade?: boolean;
    }>(),
    {
        showTopFade: true,
    }
);
</script>

<template>
    <section class="relative py-20">
        <div class="absolute inset-0 overflow-hidden">
            <slot name="background" />
        </div>

        <div
            v-if="props.showTopFade"
            class="absolute top-0 h-150 w-full left-1/2 -translate-x-1/2"
            style="background: radial-gradient(farthest-side at top center, var(--color-black-200), var(--color-black))"
        ></div>

        <Container class="relative z-10">
            <div v-if="props.title" class="flex justify-between items-end pb-4">
                <h2 class="text-4xl font-bold">
                    {{ props.title }}
                </h2>

                <v-btn to="/videos">view all</v-btn>
            </div>

            <slot />
        </Container>
    </section>
</template>
