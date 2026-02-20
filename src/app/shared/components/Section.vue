<script setup lang="ts">
import { useSlots } from 'vue';
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const slots = useSlots();
const props = withDefaults(
    defineProps<{
        title?: string;
        moreLink?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
        moreText?: string;
    }>(),
    {
        moreText: 'view more',
    }
);
</script>

<template>
    <section class="relative overflow-hidden py-6 border-bf border-black-500">
        <Container class="relative">
            <div v-if="slots.actions || props.title" class="flex justify-between gap-4 pb-2">
                <h2 class="text-2xl font-bold lg:text-3xl">{{ props.title }}</h2>
                <slot name="actions"></slot>
            </div>

            <slot></slot>

            <div v-if="props.moreLink" class="flex gap-4 items-center pt-6">
                <div class="h-[1px] bg-black-400 grow"></div>
                <RouterLink
                    :to="props.moreLink"
                    class="flex items-center gap-1 transition-all lowercase text-primary! hover:text-primary-light!"
                >
                    {{ props.moreText }}
                    <v-icon size="x-small" icon="mdi-chevron-right" class="mt-[3px]" />
                </RouterLink>
                <div class="h-[1px] bg-black-400 grow"></div>
            </div>
        </Container>
    </section>
</template>
