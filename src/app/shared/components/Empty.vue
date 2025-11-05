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
        <div class="flex flex-col items-center justify-center p-4 rounded-md">
            <div v-if="props.icon" class="bg-white/10 rounded-md p-3 mb-2">
                <v-icon :icon="props.icon" />
            </div>

            <h3 v-if="props.title" class="text-muted text-lg font-medium">{{ props.title }}</h3>
            <p v-if="props.description" class="text-muted-more text-sm">{{ props.description }}</p>

            <div v-if="slots.default">
                <slot></slot>
            </div>
        </div>
    </div>
</template>
