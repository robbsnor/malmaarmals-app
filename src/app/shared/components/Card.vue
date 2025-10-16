<script setup lang="ts">
import { twMerge } from 'tailwind-merge';
import { computed } from 'vue';
</script>

<template>
    <div class="bg-black-200 border border-black-500 rounded-md">
        <slot></slot>
    </div>
</template>
