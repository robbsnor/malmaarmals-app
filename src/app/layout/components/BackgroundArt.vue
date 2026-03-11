<script setup lang="ts">
import { computed } from 'vue';
import { useWindowScroll } from '@vueuse/core';

const { y } = useWindowScroll();

const paralaxStyle = computed(() => ({
    transform: `translateY(${-y.value * 0.2}px)`,
    filter: `blur(${Math.min(20, Math.max(5, y.value * 0.05))}px)`,
}));
</script>

<template>
    <div :style="paralaxStyle" class="fixed h-4/6 w-full bg-black pointer-events-none -z-100 overflow-hidden">
        <Container class="relative h-full">
            <div class="flex gap-4 absolute right-0 translate-x-1/6 h-full">
                <div
                    v-for="i in 3"
                    :key="i"
                    class="w-80 h-full pr-[1px] bg-gradient-to-br from-black to-primary -skew-x-25"
                >
                    <div class="w-full h-full bg-gradient-to-br from-black to-black/50"></div>
                </div>
            </div>
        </Container>

        <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-30% via-black/60 lg:via-transparent lg:to-100% to-black-100"
        ></div>
    </div>
</template>
