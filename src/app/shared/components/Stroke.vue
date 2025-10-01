<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        direction?: 'horizontal' | 'vertical';
    }>(),
    {
        direction: 'horizontal',
    }
);
</script>

<template>
    <div
        :class="{ 'h-[1px]': props.direction === 'horizontal', 'w-[1px] hf-full': props.direction === 'vertical' }"
        class="bg-radialg from-black-900 to-transparent bg-black-500"
    ></div>
</template>
