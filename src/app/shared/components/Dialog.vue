<script setup lang="ts">
import { useSlots } from 'vue';

const slots = useSlots();
const emits = defineEmits(['close']);

const dialog = defineModel<boolean>();

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        width?: string | number;
        showCloseButton?: boolean;
        icon?: string;
        iconColor?: string;
    }>(),
    {
        title: 'Dialog',
        width: 720,
        showCloseButton: true,
    }
);

const close = () => {
    emits('close');
    dialog.value = !dialog.value;
};
</script>

<template>
    <v-dialog v-model="dialog" v-bind="props">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <div class="bg-black-200 border border-black-500 p-6 rounded-md flex flex-col gap-4">
            <div class="flex gap-4 items-center">
                <div v-if="props.icon" class="sm:flex justify-center items-center p-2 bg-black-400 rounded-md hidden">
                    <v-icon :color="props.iconColor" :icon="props.icon" class=" " />
                </div>

                <div class="mr-8">
                    <h2 class="text-2xl font-bold">{{ props.title }}</h2>
                    <p v-if="props.description" class="text-muted">{{ props.description }}</p>
                </div>

                <button
                    v-if="props.showCloseButton"
                    @click="close()"
                    class="group ml-auto p-2 rounded-md hover:bg-black-400"
                >
                    <div class="group-hover:rotate-90 transition-all">
                        <span class="sr-only">Close</span>
                        <v-icon icon="mdi-window-close" class="dialog__close-icon" />
                    </div>
                </button>
            </div>

            <div>
                <slot></slot>
            </div>

            <div class="flex justify-end gap-4">
                <slot v-if="slots.footer" name="footer"></slot>
            </div>
        </div>
    </v-dialog>
</template>
