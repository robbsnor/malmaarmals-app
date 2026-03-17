<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Search from './Search.vue';
import { useDisplay } from 'vuetify/lib/composables/display.mjs';

const route = useRoute();
const { lgAndUp } = useDisplay();

const tabs = [
    { label: 'streams', value: 'streams', to: { name: 'streams' } },
    { label: 'playlists', value: 'playlists', to: { name: 'playlists' } },
    { label: 'games', value: 'games', to: { name: 'games' } },
] as const;

const activeTab = computed(() => {
    if (route.name === 'playlists') return 'playlists';
    if (route.name === 'games') return 'games';

    return 'streams';
});
</script>

<template>
    <div v-if="!lgAndUp" class="pt-4 fixed w-full top-0 z-1">
        <Container>
            <Search density="comfortable" />
        </Container>

        <Container>
            <div class="mt-4 rounded-xl border border-black-600 bg-black-500/50 p-1.5 backdrop-blur-xl">
                <div class="grid grid-cols-3 gap-2">
                    <RouterLink
                        v-for="tab in tabs"
                        :key="tab.value"
                        :to="tab.to"
                        class="group relative overflow-hidden rounded-lg px-2 py-2.5 text-center font-bold lowercase transition-colors"
                        :class="tab.value === activeTab ? 'text-primary' : 'text-muted hover:text-light'"
                    >
                        <span class="relative z-1 uppercase">{{ tab.label }}</span>

                        <div
                            class="absolute inset-0 rounded-lg transition-all"
                            :class="
                                tab.value === activeTab
                                    ? 'bg-primary/15 ring-1 ring-inset ring-primary/35'
                                    : 'bg-transparent group-hover:bg-black-400/70'
                            "
                        ></div>

                        <div
                            class="pointer-events-none absolute inset-x-5 bottom-0 h-1.5 rounded-full bg-primary blur-md transition-opacity"
                            :class="tab.value === activeTab ? 'opacity-75' : 'opacity-0 group-hover:opacity-45'"
                        ></div>
                    </RouterLink>
                </div>
            </div>
        </Container>
    </div>
</template>
