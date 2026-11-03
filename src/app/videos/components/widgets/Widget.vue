<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string;
        description?: string;
        icon?: string;
    }>(),
    {}
);
</script>

<template>
    <div>
        <div class="border-black-500 flex items-end justify-between border-b pb-2">
            <div>
                <div class="text-2xl font-bold">
                    {{ props.title }}
                </div>
                <div v-if="props.description" class="text-md text-muted">
                    {{ props.description }}
                </div>
            </div>

            <slot name="actions"></slot>
        </div>

        <div>
            <slot></slot>
        </div>
    </div>
</template>
