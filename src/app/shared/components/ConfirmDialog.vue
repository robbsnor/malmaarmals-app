<script setup lang="ts">
import type { ConfirmDialogProps } from '../models/dialog.models';

const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    width: 500,
});

function cancel() {
    emits('cancel');
    dialog.value = false;
}

function confirm() {
    emits('confirm');
    dialog.value = false;
}
</script>

<template>
    <Dialog v-model="dialog" v-bind="props">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <slot></slot>

        <template #footer>
            <v-btn variant="text" @click="cancel">{{ props.cancelText }}</v-btn>
            <v-btn
                :loading="props.loading"
                :color="props.confirmColor"
                :prepend-icon="props.confirmIcon"
                @click="confirm"
            >
                {{ props.confirmText }}
            </v-btn>
        </template>
    </Dialog>
</template>
