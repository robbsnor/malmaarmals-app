<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
    defineProps<{
        items: string
    }>(),
    {
        items: 'test',
    },
)
</script>

<template>
    <div>login page</div>
</template>
