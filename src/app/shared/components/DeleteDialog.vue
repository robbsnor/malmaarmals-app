<script setup lang="ts">
import type { ConfirmDialogProps } from '../models/dialog.models';

const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    confirmText: 'Delete',
    confirmColor: 'error',
    cancelText: 'Cancel',
    icon: 'mdi-trash-can-outline',
    iconColor: 'error',
});
</script>

<template>
    <ConfirmDialog v-model="dialog" v-bind="props" @cancel="emits('cancel')" @confirm="emits('confirm')">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <slot></slot>
    </ConfirmDialog>
</template>
