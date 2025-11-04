<script setup lang="ts">
const props = defineProps<{
    title?: string;
}>();
</script>

<template>
    <div class="bg-black-200 border border-black-400 p-4 rounded-t-xl overflow-auto">
        <h3 v-if="props.title" class="font-bold text-lg mb-4">{{ props.title }}</h3>
        <div class="overflow-auto max-h-[60vh]">
            <slot></slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>
