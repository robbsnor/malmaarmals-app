<script setup lang="ts">
import { computed } from 'vue';

const model = defineModel<Array<any>>();

const props = withDefaults(
    defineProps<{
        value: any;
        label: string;
        description?: string;
    }>(),
    {}
);

const isChecked = computed(() => !!model.value.includes(props.value));
</script>

<template>
    <label
        :class="[
            'flex items-center justify-center border border-black-600 p-4 text-muted rounded-md hover:border-primary  cursor-pointer',
            isChecked ? 'bg-primary' : '',
        ]"
    >
        <input type="checkbox" :value="props.value" v-model="model" class="hidden" />
        <span>{{ props.label }}</span>
    </label>
</template>
