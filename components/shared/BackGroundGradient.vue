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
    <div class="relative bg-gradient-to-r from-white/0 via-white/3 to-white/0">
        <div
            class="absolute top-0 h-[1px] w-full bg-gradient-to-r from-white/1 via-white/10 to-white/1"
        ></div>
        <slot></slot>

        <div
            class="absolute bottom-0 h-[1px] w-full bg-gradient-to-r from-white/1 via-white/10 to-white/1"
        ></div>
    </div>
</template>
