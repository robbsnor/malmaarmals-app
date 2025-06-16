<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        title: string
    }>(),
    {},
)
</script>

<template>
    <Container>
        <div class="flex flex-col gap-4 py-20">
            <div class="flex items-end justify-between">
                <h2 class="text-4xl font-black uppercase">
                    {{ props.title }}
                </h2>
                <NuxtLink
                    to="/videos"
                    class="text-primary hover:bg-black-600 flex cursor-pointer items-center gap-1 rounded-md py-0.5 pr-1 pl-2 text-sm transition-all"
                >
                    View all
                    <UIcon name="i-lucide-chevron-right" size="14" />
                </NuxtLink>
            </div>

            <slot />
        </div>
    </Container>
</template>
