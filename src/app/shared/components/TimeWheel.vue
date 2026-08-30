<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        modelValue: number;
        min?: number;
        max?: number;
        step?: number;
        label?: string;
    }>(),
    {
        min: 0,
        max: 59,
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
    return Math.min(Math.max(props.modelValue, props.min), props.max);
});

const currentIndex = computed(() => values.value.indexOf(normalizedValue.value));

function setValue(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), values.value.length - 1);
    emit('update:modelValue', values.value[nextIndex]);
}

function stepValue(step: number) {
    setValue(currentIndex.value + step);
}

function onWheel(event: WheelEvent) {
    event.preventDefault();
    if (event.deltaY > 0) stepValue(1);
    if (event.deltaY < 0) stepValue(-1);
}

let dragStartY = 0;
let lastDragY = 0;

function onPointerDown(event: PointerEvent) {
    dragStartY = event.clientY;
    lastDragY = event.clientY;
    (event.currentTarget as HTMLElement | null)?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event: PointerEvent) {
    const delta = event.clientY - lastDragY;
    if (Math.abs(delta) < 12) return;

    if (delta > 0) stepValue(1);
    if (delta < 0) stepValue(-1);

    lastDragY = event.clientY;
}

function onPointerUp() {
    dragStartY = 0;
    lastDragY = 0;
}
</script>

<template>
    <div
        class="flex w-20 flex-col items-center"
        @wheel="onWheel"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointerleave="onPointerUp"
        @pointercancel="onPointerUp"
    >
        <div class="relative h-40 w-full overflow-hidden rounded-xl border border-black-500 bg-black-400 shadow-inner">
            <div class="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-10 -translate-y-1/2 border-y border-black-500 bg-black-300/80"></div>

            <div class="relative z-20 flex h-full flex-col items-center justify-center gap-1 px-2 py-4 text-center">
                <button
                    v-for="value in values"
                    :key="value"
                    type="button"
                    class="flex h-10 w-full items-center justify-center rounded-md text-base font-medium transition-colors"
                    :class="{
                        'bg-primary/20 text-normal': value === normalizedValue,
                        'text-muted': value !== normalizedValue,
                    }"
                    @click="emit('update:modelValue', value)"
                >
                    {{ value.toString().padStart(2, '0') }}
                </button>
            </div>
        </div>

        <div v-if="label" class="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
            {{ label }}
        </div>
    </div>
</template>
