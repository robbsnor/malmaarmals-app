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
        class="poopie___ bg-radial from-black-900 to-transparent"
    ></div>
</template>
