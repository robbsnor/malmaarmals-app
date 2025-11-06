<script setup lang="ts">
const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        confirmText?: string;
        confirmColor?: string;
        cancelText?: string;
        width?: string | number;
    }>(),
    {
        confirmText: 'Delete',
        confirmColor: 'error',
        cancelText: 'Cancel',
    }
);

function confirm() {
    emits('confirm');
    dialog.value = false;
}
</script>

<template>
    <ConfirmDialog v-model="dialog" v-bind="props" @confirm="confirm">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <slot></slot>
    </ConfirmDialog>
</template>
