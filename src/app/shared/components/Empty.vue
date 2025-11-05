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
    <div class="flex justify-center items-center">
        <div class="flex flex-col items-center justify-center p-4 rounded-md bg-black-300 border border-black-500">
            <div v-if="props.icon" class="bg-black-400 rounded-md p-2 mb-2">
                <v-icon :icon="props.icon" />
            </div>

            <h3 v-if="props.title" class="text-normal text-lg font-medium mb-2">{{ props.title }}</h3>
            <p v-if="props.description" class="text-muted text-sm">{{ props.description }}</p>

            <div v-if="slots.default">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
