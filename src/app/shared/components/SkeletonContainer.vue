<script setup lang="ts">
import { computed, ref } from 'vue';
</script>

<template>
    <div class="relative overflow-hidden h-full rounded-md">
        <slot></slot>

        <div class="absolute bg-gradient-to-t from-black/50 to-black/0 inset-0"></div>
    </div>
</template>
