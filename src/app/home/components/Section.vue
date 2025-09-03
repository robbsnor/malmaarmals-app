<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string;
    }>(),
    {}
);
</script>

<template>
    <section class="relative py-20">
        <div
            class="absolute top-0 left-0 right-0 h-150"
            style="background: radial-gradient(farthest-side at top center, var(--color-black-200), transparent)"
        ></div>

        <Container class="relative z-10">
            <div v-if="props.title" class="flex justify-between items-end pb-4">
                <h2 class="text-4xl font-bold">
                    {{ props.title }}
                </h2>

                <UButton to="/videos" variant="ghost">view all</UButton>
            </div>

            <slot />
        </Container>
    </section>
</template>
