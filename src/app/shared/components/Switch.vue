<script setup lang="ts">
import { useAttrs } from 'vue';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';

defineOptions({ inheritAttrs: false });

const model = defineModel();

const props = withDefaults(
    defineProps<{
        description?: string;
        isNested?: boolean;
    }>(),
    {}
);

const attrs = useAttrs();
const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
</script>

<template>
    <div v-bind="rootAttrs" class="relative flex gap-4" :class="{ 'pb-4': props.isNested }">
        <div v-if="props.isNested" class="size-3 mt-2 border-b-2 border-l-2 border-black-600 rounded-bl-md"></div>

        <div class="grow">
            <v-switch v-bind="controlAttrs" hide-details="auto" density="compact" v-model="model" />

            <div class="text-muted text-xs block relative -top-3 pr-16" :class="{ 'opacity-50': attrs.disabled }">
                <slot name="description">{{ props.description }}</slot>
            </div>
        </div>
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
