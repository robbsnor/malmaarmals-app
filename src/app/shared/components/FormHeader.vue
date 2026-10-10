<script setup lang="ts">
const props = defineProps<{ title: string }>();
</script>

<template>
    <div class="mb-2">
        <div class="text-2xl font-black pb-1">
            {{ props.title }}
        </div>

        <div class="flex gap-4">
            <div class="h-px grow bg-black-500"></div>
            <div class="h-px bg-black-500 w-10"></div>
        </div>
    </div>
</template>
