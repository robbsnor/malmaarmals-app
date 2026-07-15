<script setup lang="ts">
import { useAttrs } from 'vue';
import { filterInputAttrs } from 'vuetify/lib/util/helpers.mjs';

defineOptions({ inheritAttrs: false });

const model = defineModel();

const props = withDefaults(
    defineProps<{
        description?: string;
    }>(),
    {}
);

const attrs = useAttrs();
const [rootAttrs, controlAttrs] = filterInputAttrs(attrs);
</script>

<template>
    <div class="relative" style="display: flow-root" v-bind="rootAttrs">
        <v-switch v-bind="controlAttrs" hide-details="auto" density="comfortable" v-model="model" />

        <div class="text-muted text-xs block relative -top-3">
            <slot name="description">{{ props.description }}</slot>
        </div>
    </div>
</template>
