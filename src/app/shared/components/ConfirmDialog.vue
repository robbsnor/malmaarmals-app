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
        icon: 'mdi-information',
        confirmText: 'Confirm',
        confirmColor: 'primary',
        cancelText: 'Cancel',
    }
);

function cancel() {
    emits('cancel');
    dialog.value = false;
}
</script>

<template>
    <Dialog
        v-model="dialog"
        :title="props.title"
        :description="props.description"
        :icon="props.icon"
        :width="props.width"
    >
        <slot></slot>

        <template #footer>
            <div class="flex justify-end gap-4">
                <v-btn variant="text" @click="cancel">{{ props.cancelText }}</v-btn>
                <v-btn :color="props.confirmColor" @click="emits('confirm')">{{ props.confirmText }}</v-btn>
            </div>
        </template>
    </Dialog>
</template>
