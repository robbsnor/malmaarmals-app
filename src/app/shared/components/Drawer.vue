<script setup lang="ts">
import { computed, useSlots, useTemplateRef, watch } from 'vue';

const sheet = defineModel<boolean>();
const slots = useSlots();
const scrollContainerRef = useTemplateRef<HTMLElement>('scrollContainerRef');
const emits = defineEmits<{
    (e: 'open'): void;
    (e: 'close'): void;
}>();
const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        inset?: boolean;
        padding?: boolean;
        eager?: boolean;
        width?: string | number;
    }>(),
    {
        width: 600,
        inset: true,
        padding: true,
    }
);

const _props = computed(() => {
    const { title, ...rest } = props;
    return rest;
});

watch(
    () => sheet.value,
    (newVal) => {
        if (newVal) {
            emits('open');
        } else {
            emits('close');
        }
    }
);
</script>

<template>
    <v-bottom-sheet v-model="sheet" v-bind="_props">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <div class="bg-black-200 border-t border-x border-black-500 rounded-t-xl">
            <div
                v-if="props.title || slots.actions"
                class="flex gap-4 justify-between items-center px-4 py-3 border-b border-black-500"
            >
                <div>
                    <h3 class="font-bold text-xl">{{ props.title }}</h3>
                    <p v-if="props.description" class="text-muted">{{ props.description }}</p>
                </div>

                <slot name="actions"></slot>
            </div>

            <div :class="props.padding ? 'p-4' : ''" class="max-h-[60vh] overflow-auto overflow-x-hidden">
                <slot></slot>
            </div>

            <div v-if="slots.footer" class="flex flex-wrap justify-end gap-4 p-4 border-t border-black-500">
                <slot name="footer"></slot>
            </div>
        </div>
    </v-bottom-sheet>
</template>
