<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        width?: string;
        padding?: boolean;
    }>(),
    {
        width: '1920px',
        padding: true,
    }
);
</script>

<template>
    <div class="mx-auto w-full" :class="{ 'px-4': props.padding }" :style="{ maxWidth: props.width }">
        <slot></slot>
    </div>
</template>
