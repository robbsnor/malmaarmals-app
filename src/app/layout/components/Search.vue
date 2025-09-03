<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        // items: string;
    }>(),
    {
        // items: "test",
    }
);
</script>

<template>
    <div class="relative flex items-center">
        <UInput
            type="text"
            placeholder="Search..."
            variant="soft"
            trailing-icon="i-lucide-search"
            class="w-100"
            size="lg"
        />

        <!-- <div
            class="bg-black-600 absolute -top-[10px] left-1/2 z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-md"
        ></div> -->
    </div>
</template>
