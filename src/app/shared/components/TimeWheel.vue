<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: number;
        min?: number;
        max?: number;
        availableMax?: number;
        step?: number;
        label?: string;
    }>(),
    {
        min: 0,
        max: 59,
        availableMax: undefined,
        step: 1,
        label: '',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void;
}>();

const values = computed(() => {
    const arr: number[] = [];

    for (let value = props.min; value <= props.max; value += props.step) {
        arr.push(value);
    }

    return arr;
});

const normalizedValue = computed(() => {
    if (!Number.isFinite(props.modelValue)) return props.min;
    return Math.min(Math.max(props.modelValue, props.min), props.max, props.availableMax ?? props.max);
});

const currentIndex = computed(() => values.value.indexOf(normalizedValue.value));
const wheelElement = ref<HTMLElement | null>(null);
const rowHeight = 40;
let scrollTimer: ReturnType<typeof setTimeout> | undefined;

function setValue(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), values.value.length - 1);
    const nextValue = values.value[nextIndex];
    const availableMax = props.availableMax ?? props.max;
    const selectedValue = Math.min(nextValue, availableMax);
    emit('update:modelValue', selectedValue);
}

function isAvailable(value: number) {
    return value <= (props.availableMax ?? props.max);
}

function scrollToCurrent(behavior: ScrollBehavior = 'auto') {
    wheelElement.value?.scrollTo({
        top: currentIndex.value * rowHeight,
        behavior,
    });
}

function onScroll(event: Event) {
    const element = event.currentTarget as HTMLElement;
    const nextIndex = Math.min(Math.max(Math.round(element.scrollTop / rowHeight), 0), values.value.length - 1);

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
        setValue(nextIndex);
    }, 120);
}

watch(
    normalizedValue,
    async () => {
        await nextTick();
        scrollToCurrent();
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex w-20 flex-col items-center">
        <div class="relative h-40 w-full overflow-hidden rounded-xl border border-black-500 bg-black-400 shadow-inner">
            <div
                ref="wheelElement"
                class="absolute inset-0 overflow-auto [scrollbar-width:none]"
                @scroll.passive="onScroll"
            >
                <div class="relative z-20 flex flex-col items-center text-center">
                    <div class="h-[60px] shrink-0"></div>
                    <button
                        v-for="(value, index) in values"
                        :key="value"
                        type="button"
                        class="flex h-10 w-full shrink-0 items-center justify-center text-base font-medium transition-colors"
                        :class="
                            isAvailable(value)
                                ? 'text-muted hover:bg-primary/10'
                                : 'cursor-not-allowed text-muted-more opacity-40'
                        "
                        :disabled="!isAvailable(value)"
                        @click="
                            setValue(index);
                            scrollToCurrent('smooth');
                        "
                    >
                        {{ value.toString().padStart(2, '0') }}
                    </button>
                    <div class="h-[60px] shrink-0"></div>
                </div>
            </div>

            <div class="pointer-events-none absolute inset-0 top-1/2 z-10 h-10 -translate-y-1/2 bg-primary/40">
                <!-- <div class="absolute inset-x-0 top-0 h-px bg-black-500"></div>
                <div class="absolute inset-x-0 bottom-0 h-px bg-black-500"></div> -->
            </div>
        </div>

        <div v-if="label" class="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {{ label }}
        </div>
    </div>
</template>
