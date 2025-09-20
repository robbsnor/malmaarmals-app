<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        width?: string;
    }>(),
    {
        width: '1920px',
    }
);
</script>

<template>
    <div class="mx-auto w-full px-4" :style="{ maxWidth: props.width }">
        <slot></slot>
    </div>
</template>
