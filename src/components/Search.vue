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
        <input
            type="text"
            placeholder="Search..."
            class="bg-black-300 focus:ring-primary-500 relative z-20 w-[420px] rounded-md px-4 py-2 text-white transition-all focus:ring-2 focus:outline-none"
        />

        <!-- <div
            class="bg-black-600 absolute -top-[10px] left-1/2 z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-md"
        ></div> -->
    </div>
</template>
