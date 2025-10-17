<script setup lang="ts">
import { computed, useSlots } from 'vue';

const slots = useSlots();

const props = defineProps<{
    title: string;
    description?: string;
    icon?: string;
}>();
</script>
<template>
    <div class="flex flex-col items-center justify-center p-6 rounded-lg">
        <div v-if="props.icon" class="bg-gray-50 border border-gray-200 rounded-full p-4 mb-5">
            <v-icon :icon="props.icon" class="text-primary-600" />
        </div>

        <h3 v-if="props.title" class="text-gray-800 text-lg font-medium mb-2">{{ props.title }}</h3>
        <p v-if="props.description" class="text-gray-500 text-sm">{{ props.description }}</p>

        <div v-if="slots.default" class="mt-4">
            <slot></slot>
        </div>
    </div>
</template>
