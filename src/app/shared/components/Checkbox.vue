<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        items?: string;
    }>(),
    {
        items: 'test',
    }
);
</script>

<template>
    <div class="relative">
        <label
            class="block text-center p-2 bg-black-300 border-1 border-black-400 rounded cursor-pointer transition-all hover:bg-black-600"
            :for="year.toString()"
            :class="{ 'bg-primary border-primary': archiveStore.form.years.includes(year) }"
        >
            {{ year }}
        </label>
        <input
            :id="year.toString()"
            type="checkbox"
            :label="year.toString()"
            hide-details="auto"
            v-model="archiveStore.form.years"
            :value="year"
            color="primary"
            density="compact"
            class="opacity-0 absolute top-0 left-0"
        />
    </div>
</template>
