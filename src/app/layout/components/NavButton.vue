<script setup lang="ts">
const props = defineProps<{ to: any }>();
</script>

<template>
    <v-btn
        color="primary"
        variant="text"
        active-class="bg-red-600  text-white"
        class="border-b-2 border-primary flex justify-center items-center px-4 py-2 font-bold capitalize transition-all text-muted"
        v-bind="props"
    >
        <slot></slot>
    </v-btn>
</template>
