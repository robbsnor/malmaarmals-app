<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    title: string;
    icon: string;
}>();

const emit = defineEmits<{
    (e: 'back'): void;
}>();
</script>

<template>
    <div @click="emit('back')" class="flex items-center gap-0">
        <button class="relative shrink-0 p-4 pr-6 -m-4">
            <v-icon icon="mdi-chevron-left"></v-icon>
        </button>

        <div class="font-bold text-xl">{{ props.title }}</div>
    </div>
</template>
