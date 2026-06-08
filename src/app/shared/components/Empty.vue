<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        icon?: string;
    }>(),
    {}
);
</script>

<template>
    <div class="flex justify-center items-center">
        <div class="flex flex-col items-center justify-center p-8 rounded-md">
            <div v-if="props.icon" class="relative flex items-center justify-center w-12 aspect-square mb-2">
                <div class="absolute inset-0 h-full w-full bg-white/5 rounded-md"></div>
                <v-icon :icon="props.icon" />
            </div>

            <h3 v-if="props.title" class="text-center text-lg font-bold">{{ props.title }}</h3>
            <div class="text-muted text-center text-base">
                <slot name="description">
                    {{ props.description }}
                </slot>
            </div>

            <div v-if="slots.default" class="pt-4">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
