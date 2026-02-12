<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string;
    }>(),
    {}
);
</script>

<template>
    <div class="bg-black-200 rounded-lg overflow-hidden max-h-[80vh]">
        <div class="flex justify-between border-b border-black-400 px-4 py-3 items-end">
            <div class="font-bold text-2xl">
                {{ title }}
            </div>
            <slot name="actions"></slot>
        </div>

        <slot></slot>
    </div>
</template>
