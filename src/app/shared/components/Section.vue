<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const attrs = useAttrs();
const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title?: string;
        moreLink?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
        moreText?: string;
        moreIcon?: string;
    }>(),
    {
        moreText: 'view more',
        moreIcon: 'mdi-chevron-right',
    }
);

const hasMoreClickListener = computed(() => typeof attrs.onMoreClick === 'function');
const hasMore = computed(() => Boolean(props.moreLink) || hasMoreClickListener.value);

function onMoreClick() {
    if (typeof attrs.onMoreClick === 'function') {
        attrs.onMoreClick();
    }
}
</script>

<template>
    <section class="relative overflow-hidden py-6 border-bf border-black-500">
        <Container class="relative">
            <div v-if="slots.actions || props.title" class="flex justify-between items-end gap-4 pb-4">
                <h2 class="text-2xl font-bold lg:text-3xl">{{ props.title }}</h2>
                <slot name="actions"></slot>
            </div>

            <slot></slot>

            <div v-if="hasMore" class="flex gap-4 items-center pt-6">
                <div class="h-[1px] bg-black-400 grow"></div>
                <component
                    :is="props.moreLink ? 'RouterLink' : 'button'"
                    :to="props.moreLink"
                    @click="onMoreClick"
                    class="flex items-center gap-1 transition-all lowercase text-primary! hover:text-primary-light! hover:bg-primary/10 rounded-full px-4 py-1"
                >
                    {{ props.moreText }}
                    <v-icon :icon="props.moreIcon" size="x-small" class="mt-[3px] -mr-[3px]" />
                </component>
                <div class="h-[1px] bg-black-400 grow"></div>
            </div>
        </Container>
    </section>
</template>
