<script setup lang="ts">
import type { ConfirmDialogProps } from './ConfirmDialog.vue';

export interface DeleteDialogProps extends ConfirmDialogProps {}

const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(defineProps<DeleteDialogProps>(), {
    confirmText: 'Delete',
    confirmColor: 'error',
    cancelText: 'Cancel',
});

function confirm() {
    emits('confirm');
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
