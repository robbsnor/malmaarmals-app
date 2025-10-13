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
        width: 500,
        showCloseButton: true,
    }
);

const close = () => {
    emits('close');
    dialog.value = !dialog.value;
};
</script>

<template>
    <v-dialog v-model="dialog" :width="props.width">
        <div class="bg-black-200 border border-black-500 p-6 rounded-md flex flex-col gap-4">
            <div class="flex gap-4 items-center">
                <!-- <div v-if="props.icon" class="flex justify-center items-center p-2 bg-black-400 rounded-md">
                    <v-icon :color="props.iconColor" :icon="props.icon" class=" " />
                </div> -->

                <div class="  ">
                    <h2 class="text-2xl font-bold">{{ props.title }}</h2>
                    <p v-if="props.description" class="text-sm text-muted">{{ props.description }}</p>
                </div>

                <button v-if="props.showCloseButton" @click="close()" class="ml-auto">
                    <span class="sr-only">Close</span>
                    <v-icon icon="mdi-window-close" class="dialog__close-icon" />
                </button>
            </div>

            <slot></slot>

            <slot v-if="slots.footer" class=" " name="footer"></slot>
        </div>
    </v-dialog>
</template>
