<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title: string;
        description?: string;
        icon?: string;
    }>(),
    {}
);
</script>

<template>
    <div class="flex justify-center items-center">
        <div class="flex flex-col items-center justify-center p-8 rounded-md">
            <div v-if="props.icon" class="bg-white/10 rounded-md p-3 mb-2">
                <v-icon :icon="props.icon" />
            </div>

            <h3 v-if="props.title" class="text-normal text-center text-lg font-bold">{{ props.title }}</h3>
            <div v-if="props.description" class="text-muted-more text-center text-sm">{{ props.description }}</div>

            <div v-if="slots.default" class="pt-4">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
