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
    <ConfirmDialog
        v-model="dialog"
        :title="props.title"
        :description="props.description"
        :confirmText="props.confirmText"
        :confirmColor="props.confirmColor"
        :width="props.width"
        @confirm="confirm"
    >
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <slot></slot>
    </ConfirmDialog>
</template>
