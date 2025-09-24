<script setup lang="ts">
import { gsap } from 'gsap';
import { onMounted, ref } from 'vue';

const repeatCount = 4; // Adjust for more/less repetitions
const words = Array(repeatCount).fill('malmaarmals');
const textRow = ref<HTMLElement | null>(null);

onMounted(() => {
    const el = textRow.value;
    if (!el) return;
    const textWidth = el.scrollWidth;
    gsap.fromTo(
        el,
        { x: 0 },
        {
            x: -textWidth / 2,
            duration: 40,
            ease: 'none',
            repeat: -1,
            repeatRefresh: true,
            onStart: () => {
                console.log('Animation started');
                console.log(-textWidth / 2);
            },
            onRepeat: () => {
                gsap.set(el, { x: -textWidth / 2 });
            },
        }
    );
});
</script>

<template>
    <div class="overflow-hidden w-full h-screen flex items-center">
        <div ref="textRow" class="flex whitespace-nowrap" style="will-change: transform">
            <span
                v-for="(word, i) in words"
                :key="i"
                class="text text-9xl font-black uppercase mx-8 text-white select-none"
            >
                {{ word }}
            </span>
        </div>
    </div>
</template>
