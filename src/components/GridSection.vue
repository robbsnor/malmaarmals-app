<script setup lang="ts">
import { useSlots, computed } from 'vue';
const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title: string;
        cols?: number;
        to: string;
    }>(),
    {
        cols: 4,
    }
);

const visibleChildren = computed(() => {
    const children = slots.default!()[0].children ?? [];
    return children.slice(0, props.cols);
});
</script>

<template>
    <div class="flex flex-col gap-4">
        <div class="flex items-end justify-between">
            <div>
                <h2 class="text-2xl font-bold">
                    {{ title }}
                </h2>
            </div>
            <RouterLink
                :to="props.to"
                class="text-primary hover:bg-black-600 flex cursor-pointer items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-sm transition-all"
            >
                View all
                <UIcon name="i-lucide-chevron-right" size="14" />
            </RouterLink>
        </div>

        <div
            class="grid gap-8"
            :class="{
                'grid-cols-1': cols === 1,
                'grid-cols-2': cols === 2,
                'grid-cols-3': cols === 3,
                'grid-cols-4': cols === 4,
                'grid-cols-5': cols === 5,
                'grid-cols-6': cols === 6,
                'grid-cols-7': cols === 7,
                'grid-cols-8': cols === 8,
            }"
        >
            <template v-for="(item, index) in visibleChildren" :key="index">
                <component :is="item" />
            </template>
        </div>
    </div>
</template>
