<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter, type RouteLocationRaw } from 'vue-router';

const props = defineProps<{ to: RouteLocationRaw }>();

const route = useRoute();
const router = useRouter();

const hasMatchingQuery = computed(() => {
    const target = router.resolve(props.to);

    for (const [key, value] of Object.entries(target.query)) {
        const currentValue = route.query[key];

        if (Array.isArray(value)) {
            if (!Array.isArray(currentValue)) return false;
            if (value.length !== currentValue.length) return false;

            const allValuesMatch = value.every((entry, index) => entry === currentValue[index]);
            if (!allValuesMatch) return false;
            continue;
        }

        if (currentValue !== value) return false;
    }

    return true;
});
</script>

<template>
    <RouterLink
        v-slot="{ href, navigate, isActive }"
        custom
        :to="props.to"
        class="group relative flex h-full flex-col items-center justify-center px-4 font-bold uppercase text-muted transition-colors [&.is-active]:text-primary-light"
    >
        <a
            :href="href"
            :class="{ 'is-active': isActive && hasMatchingQuery }"
            class="group relative flex h-full flex-col items-center justify-center px-4 font-bold uppercase text-muted transition-colors [&.is-active]:text-primary-light"
            @click="navigate"
        >
            <slot></slot>

            <div
                class="absolute bottom-0 h-0.5 w-0 rounded-xl bg-primary opacity-0 transition-all duration-100 group-hover:w-4 group-hover:opacity-50 in-[.is-active]:!w-full in-[.is-active]:!opacity-100"
            ></div>

            <div
                class="pointer-events-none absolute bottom-0 -z-1 aspect-square h-[100%] translate-y-full rounded-full bg-primary opacity-0 blur-xl transition-all duration-300 group-hover:translate-y-2/3 group-hover:opacity-30 in-[.is-active]:!translate-y-1/2 in-[.is-active]:!opacity-60"
            ></div>
        </a>
    </RouterLink>
</template>
