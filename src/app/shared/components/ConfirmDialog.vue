<script setup lang="ts">
export interface ConfirmDialogProps {
    title?: string;
    description?: string;
    icon?: string;
    confirmText?: string;
    confirmColor?: string;
    confirmIcon?: string;
    cancelText?: string;
    width?: string | number;
    showCloseButton?: boolean;
    loading?: boolean;
}

const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(defineProps<ConfirmDialogProps>(), {
    confirmText: 'Confirm',
    confirmColor: 'primary',
    cancelText: 'Cancel',
    width: '500',
});

function cancel() {
    emits('cancel');
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
            <div class="flex justify-end gap-4">
                <v-btn variant="text" @click="cancel">{{ props.cancelText }}</v-btn>
                <v-btn
                    :loading="props.loading"
                    :color="props.confirmColor"
                    :prepend-icon="props.confirmIcon"
                    @click="emits('confirm')"
                >
                    {{ props.confirmText }}
                </v-btn>
            </div>
        </template>
    </Dialog>
</template>
