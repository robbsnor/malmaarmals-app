<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        side?: 'top' | 'bottom';
    }>(),
    {
        side: 'top',
    }
);

const cssClass = computed(() => {
    if (props.side === 'bottom') return '-top-8 bg-linear-to-t';

    // top
    return '-bottom-8 bg-linear-to-b';
});
</script>

<template>
    <div
        :class="cssClass"
        class="absolute inset-0 pointer-events-none bfg-red-300! from-body-bg via-body-bg/70 via-60% to-body-bg/0 backdrop-blur-[1fpx] bfg-orange-400!"
    ></div>
</template>
