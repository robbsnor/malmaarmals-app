<script setup lang="ts">
import type { Tables } from '../../shared/models/database.types';

const props = withDefaults(
    defineProps<{
        category: Tables<'categories'>;
    }>(),
    {}
);
</script>

<template>
    <div class="h-[56px] aspect-[8/11] bg-black-500 rounded-sm overflow-hidden">
        <img
            v-if="props.category.image_url"
            :src="props.category.image_url"
            :alt="props.category.title"
            class="h-full rounded-sm w-full object-cover"
        />
    </div>
</template>
