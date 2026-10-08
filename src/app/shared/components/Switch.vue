<script setup lang="ts">
import { useAttrs } from 'vue';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';

defineOptions({ inheritAttrs: false });

const model = defineModel();

const props = withDefaults(
    defineProps<{
        text?: string;
        description?: string;
    }>(),
    {}
);

const attrs = useAttrs();
const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
</script>

<template>
    <div v-bind="rootAttrs" class="relative flex gap-12 justify-between items-center">
        <FormLabel :description="props.description">{{ props.text }}</FormLabel>
        <v-switch v-bind="controlAttrs" hide-details="auto" density="compact" v-model="model" />
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
