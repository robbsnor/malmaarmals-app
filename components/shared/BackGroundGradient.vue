<script setup lang="ts">
// const props = withDefaults(
//     defineProps<{
//         items: string
//     }>(),
//     {
//         items: 'test',
//     },
// )
</script>

<template>
    <div
        class="flex justify-center bg-gradient-to-r from-white/0 via-white/3 to-white/0"
    >
        <slot></slot>
    </div>
</template>
