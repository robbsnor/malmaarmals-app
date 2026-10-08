<script setup lang="ts">
import { useAttrs, useSlots } from 'vue';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
    defineProps<{
        text?: string;
        description?: string;
    }>(),
    {}
);

const attrs = useAttrs();
const slots = useSlots();
const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
const model = defineModel();
</script>

<template>
    <div v-bind="rootAttrs" class="relative flex gap-8 justify-between items-center">
        <FormLabel :description="props.description">
            {{ props.text }}

            <template #description>
                <slot name="description"></slot>
            </template>
        </FormLabel>

        <v-switch v-bind="controlAttrs" hide-details="auto" density="compact" v-model="model" class="shrink-0!" />
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
</style>
