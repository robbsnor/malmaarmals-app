<script setup lang="ts">
import { computed, ref } from 'vue';

const props = defineProps<{
    title: string;
    icon?: string;
    showBackIcon?: boolean;
}>();

const emit = defineEmits<{
    (e: 'back'): void;
}>();
</script>

<template>
    <div @click="emit('back')" class="flex items-center gap-0 px-4 py-4 border-b border-black-500 cursor-default">
        <button v-if="props.showBackIcon" class="relative shrink-0 p-4 pr-7 -m-4">
            <v-icon icon="mdi-chevron-left"></v-icon>
        </button>

        <h3 class="font-bold text-xl">{{ props.title }}</h3>
    </div>
</template>
