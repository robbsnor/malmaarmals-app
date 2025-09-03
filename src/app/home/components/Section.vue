<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        title?: string;
        isOdd?: boolean;
    }>(),
    {
        isOdd: false,
    }
);
</script>

<template>
    <section class="py-20 bg-gradient-to-b from-bg-normal to-bg-dark">
        <Container class="relative">
            <!-- <div
                class="absolute -z-10 top-0 left-0 -translate-y-1/2 -translate-x-10 leading-none opacity-50 text-[10rem] inline-block font-bold text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text"
            >
                {{ props.title }}
            </div> -->
            <div v-if="props.title" class="flex justify-between items-end pb-4">
                <h2 class="text-2xl font-bold">
                    {{ props.title }}
                </h2>

                <UButton to="/videos" variant="ghost">view all</UButton>
            </div>

            <slot />
        </Container>
    </section>
</template>
