<script setup lang="ts">
import { useSlots } from 'vue';

const props = defineProps<{
    description?: string;
}>();

const slots = useSlots();
</script>

<template>
    <div class="text-white text-[16px] whitespace-normal tracking-[.15px] pb-2">
        <slot></slot>

        <div class="text-muted text-xs relative -mt-0.5">
            <slot name="description"> {{ props.description }} </slot>
        </div>
    </div>
</template>
