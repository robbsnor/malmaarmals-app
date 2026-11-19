<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        icon?: string;
    }>(),
    {}
);
</script>

<template>
    <div class="flex gap-4 p-4 rounded-md bg-primary-dark/15 border border-primary-dark/50">
        <v-icon v-if="props.icon" :icon="props.icon" class="mt-1" size="22"></v-icon>

        <div class="grow">
            <div v-if="props.title" class="text-lg font-bold pb-1">{{ props.title }}</div>
            <p v-if="props.description" class="text-muted m-0!">{{ props.description }}</p>
        </div>
    </div>
</template>
