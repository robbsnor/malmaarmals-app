<script setup lang="ts">
const emits = defineEmits(['confirm', 'cancel']);
const dialog = defineModel<boolean>();
const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        icon?: string;
        confirmText?: string;
        confirmColor?: string;
        cancelText?: string;
        width?: string | number;
    }>(),
    {
        icon: 'mdi-trash-can',
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
        :icon="props.icon"
        :width="props.width"
        @confirm="confirm"
    >
        <slot></slot>
    </ConfirmDialog>
</template>
