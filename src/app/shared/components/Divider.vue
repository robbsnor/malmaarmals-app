<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        text?: string;
        padding?: 'small' | 'medium' | 'large';
        theme?: 'dark' | 'darker' | 'darkest';
    }>(),
    {
        padding: 'small',
        theme: 'dark',
    }
);

const paddingMap = {
    small: 'py-1.25',
    medium: 'py-2.5',
    large: 'py-3.75',
};

const themeMap = {
    dark: 'border-black/5',
    darker: 'border-black/10',
    darkest: 'border-black/15',
};

const cssClass = computed(() => {
    return `flex items-center gap-3 border ${paddingMap[props.padding]} ${themeMap[props.theme]}`;
});
</script>

<template>
    <div :class="cssClass">
        <div class="flex-1 h-px bg-inherit border-t"></div>
        <div v-if="props.text" class="text-sm text-black/75">{{ props.text }}</div>
        <div v-if="props.text" class="flex-1 h-px bg-inherit border-t"></div>
    </div>
</template>
