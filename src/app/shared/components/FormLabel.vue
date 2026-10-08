<script setup lang="ts">
const props = defineProps<{
    description?: string;
}>();
</script>

<template>
    <div class="text-white text-[16px] whitespace-normal tracking-[.15px] pb-1">
        <slot />
        <div v-if="props.description" class="text-muted text-xs relative -mt-1">{{ props.description }}</div>
    </div>
</template>
