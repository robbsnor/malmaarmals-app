<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        title: string;
    }>(),
    {}
);
</script>

<template>
    <div class="bg-black-200 borderf border-black-400 rounded-lg p-4">
        <div class="flex justify-between border-b border-black-400 mb-4 pb-2">
            <div class="font-bold text-2xl">
                {{ title }}
            </div>
            <slot name="actions"></slot>
        </div>

        <slot></slot>
    </div>
</template>
