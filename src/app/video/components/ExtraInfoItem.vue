<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string;
    }>(),
    {}
);
</script>

<template>
    <div class="bg-black-200 border-black-500 overflow-hidden rounded-lg border">
        <div class="border-black-500 flex items-end justify-between border-b px-4 py-3">
            <div class="text-2xl font-bold">
                {{ title }}
            </div>
            <slot name="actions"></slot>
        </div>

        <slot></slot>
    </div>
</template>
