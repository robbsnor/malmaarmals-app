<script setup lang="ts">
import { useSlots } from 'vue';

const props = defineProps<{
    title?: string;
}>();

const slots = useSlots();
</script>

<template>
    <div class="bg-black-200 border-t border-x border-black-400 rounded-t-xl">
        <div
            v-if="props.title || slots.actions"
            class="flex gap-4 justify-between items-center p-4 border-b border-black-500"
        >
            <h3 class="font-bold text-lg">{{ props.title }}</h3>

            <slot name="actions"></slot>
        </div>

        <slot></slot>

        <div v-if="slots.footer" class="p-4 border-t border-black-500">
            <slot name="footer"></slot>
        </div>
    </div>
</template>
