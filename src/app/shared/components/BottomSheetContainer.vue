<script setup lang="ts">
const props = defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="bg-black-200 border border-black-400 rounded-t-xl">
        <div class="flex gap-4 justify-between items-center p-4 border-b border-black-500">
            <h3 v-if="props.title" class="font-bold text-lg">{{ props.title }}</h3>

            <slot name="actions"></slot>
        </div>

        <slot></slot>

        <div class="p-4 border-t border-black-500">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
