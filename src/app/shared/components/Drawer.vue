<script setup lang="ts">
import { template } from 'lodash';
import { computed, ref } from 'vue';
import { useSlots } from 'vue';

const sheet = defineModel<boolean>();
const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title?: string;
        inset?: boolean;
        padding?: boolean;
        eager?: boolean;
    }>(),
    {
        inset: true,
        padding: true,
    }
);
</script>

<template>
    <v-bottom-sheet v-model="sheet" :inset="props.inset" :eager="props.eager">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <div class="bg-black-200 border-t border-x border-black-400 rounded-t-xl">
            <div
                v-if="props.title || slots.actions"
                class="flex gap-4 justify-between items-center p-4 border-b border-black-500"
            >
                <h3 class="font-bold text-lg">{{ props.title }}</h3>

                <slot name="actions"></slot>
            </div>

            <div :class="props.padding ? 'p-4' : ''" class="max-h-[50vh] overflow-auto overflow-x-hidden">
                <slot></slot>
            </div>

            <div v-if="slots.footer" class="p-4 border-t border-black-500">
                <slot name="footer"></slot>
            </div>
        </div>
    </v-bottom-sheet>
</template>
