<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue';
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const attrs = useAttrs();
const slots = useSlots();

const props = withDefaults(
    defineProps<{
        title?: string;
        description?: string;
        width?: string;
        moreLink?: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
        moreText?: string;
        moreIcon?: string;
        showHeader?: boolean;
    }>(),
    {
        moreText: 'view more',
        moreIcon: 'mdi-chevron-right',
        showHeader: true,
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
    <section class="relative py-4 lg:py-6 border-bf border-black-500">
        <Container class="relative" :width="props.width">
            <div
                v-if="(slots.actions || props.title) && props.showHeader"
                class="flex justify-between items-end gap-8 pb-4"
            >
                <div>
                    <div class="flex gap-2 items-end">
                        <h2 class="text-2xl font-bold lg:text-3xl">{{ props.title }}</h2>
                        <slot name="append-title"></slot>
                    </div>

                    <div v-if="props.description || slots.description" class="text-muted">
                        <slot name="description"> </slot>
                        {{ props.description }}
                    </div>
                </div>

                <div class="shrink-0">
                    <slot name="actions"></slot>
                </div>
            </div>

            <slot></slot>

            <div v-if="hasMore" class="flex gap-4 items-center pt-6">
                <div class="h-[1px] bg-black-400 grow"></div>
                <component
                    :is="props.moreLink ? 'RouterLink' : 'button'"
                    :to="props.moreLink"
                    @click="onMoreClick"
                    class="flex items-center gap-1.5 transition-all lowercase text-primary! hover:text-primary-light! hover:bg-primary/10 rounded-full px-4 py-1"
                >
                    {{ props.moreText }}
                    <v-icon :icon="props.moreIcon" size="x-small" class="mt-[1px] -mr-[3px]" />
                </component>
                <div class="h-[1px] bg-black-400 grow"></div>
            </div>
        </Container>
    </section>
</template>
