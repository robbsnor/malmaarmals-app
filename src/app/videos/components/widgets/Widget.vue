<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string;
    }>(),
    {}
);
</script>

<template>
    <div class="overflow-hidden">
        <div class="border-black-500 flex items-end justify-between border-b pb-2">
            <div class="text-2xl font-bold">
                {{ props.title }}
            </div>
            <slot name="actions"></slot>
        </div>

        <div class="max-h-[500px] overflow-auto">
            <slot></slot>
        </div>
    </div>
</template>
