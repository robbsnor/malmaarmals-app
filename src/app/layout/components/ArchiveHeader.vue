<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Search from '../../archive/components/Search.vue';
import { useDisplay } from 'vuetify/lib/composables/display.mjs';
import NavButton from './NavButton.vue';

const route = useRoute();
const { lgAndUp } = useDisplay();

const tabs = [
    { label: 'streams', value: 'streams', to: { name: 'streams' } },
    { label: 'playlists', value: 'playlists', to: { name: 'playlists' } },
    { label: 'games', value: 'games', to: { name: 'games' } },
] as const;

const activeTab = computed(() => route.name);
</script>

<template>
    <div
        v-show="!lgAndUp && route.meta.showArchiveHeader !== false"
        class="fixed w-full top-0 z-10 bg-linear-to-b from-black from-50% to-black/0"
    >
        <Container class="relative">
            <div class="relative z-1 h-4 bg-black"></div>

            <Search id="mobileSearch" class="relative z-1" density="default" />

            <div
                class="absolute inset-0 -bottom-8 pointer-events-none bg-linear-to-b from-black via-black/70 via-60% to-black/0 backdrop-blur-[1fpx] bfg-orange-400!"
            ></div>

            <div class="grid grid-cols-3 gap-1">
                <NavButton v-for="tab in tabs" :key="tab.value" :to="tab.to" class="h-12!">
                    {{ tab.label }}
                </NavButton>
            </div>
        </Container>
    </div>
</template>
