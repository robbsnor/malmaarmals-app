<script setup lang="ts">
import { computed, ref } from 'vue';
import type { RouteLocationAsPathGeneric, RouteLocationAsRelativeGeneric } from 'vue-router';

const props = withDefaults(
    defineProps<{
        title: string;
        to: string | RouteLocationAsRelativeGeneric | RouteLocationAsPathGeneric;
    }>(),
    {}
);
</script>

<template>
    <Container width="920px">
        <div
            class="max-lg:fixed h-14 z-10 top-0 left-0 right-0 flex py-2 items-center gap-4 justify-between max-lg:bg-gradient-to-b from-black to-black/20 lg:-mx-4"
        >
            <div class="flex items-center gap-2">
                <v-btn variant="text" icon="mdi-chevron-left" :to="props.to"></v-btn>
                <div class="font-bold text-xl">{{ props.title }}</div>
            </div>

            <slot name="actions"></slot>
        </div>

        <div class="max-lg:pt-14">
            <slot></slot>
        </div>
    </Container>
</template>
