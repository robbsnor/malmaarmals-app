<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        text?: string;
        description?: string;
        disabled?: boolean;
        nested?: boolean;
    }>(),
    {}
);

const attrs = useAttrs();
const slots = useSlots();
const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
const model = defineModel();
</script>

<template>
    <div
        v-bind="rootAttrs"
        class="relative flex gap-8 items-center justify-between transition-opacity"
        :class="{
            'opacity-50 select-none': props.disabled,
            'pl-2': props.nested,
        }"
    >
        <div v-if="props.text" class="flex gap-4">
            <div
                v-if="props.nested"
                class="self-start shrink-0 rounded-bl-md border-l-2 border-b-2 border-black-2000 aspect-square w-3.5"
            ></div>

            <FormLabel :description="props.description">
                <div>{{ props.text }}</div>

                <template #description>
                    <slot name="description"></slot>
                </template>
            </FormLabel>
        </div>

        <v-switch
            :disabled="props.disabled"
            v-bind="controlAttrs"
            hide-details="auto"
            density="compact"
            v-model="model"
            class="shrink-0!"
        />
    </div>
</template>

<style scoped>
:deep(.v-selection-control) {
    flex-direction: row-reverse;
    justify-content: space-between;
}

:deep(.v-label) {
    padding-inline-start: 0 !important;
    width: 100%;
}

:deep(.v-selection-control--density-compact) {
    /* reset width */
    --v-selection-control-size: unset;
}
</style>
