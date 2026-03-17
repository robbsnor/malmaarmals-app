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
    <div class="pt-4">
        <template v-if="!lgAndUp">
            <Container>
                <Search density="comfortable" />
            </Container>

            <v-tabs :model-value="activeTab" color="primary" grow>
                <v-tab v-for="tab in tabs" :key="tab.value" :value="tab.value" :to="tab.to">
                    {{ tab.label }}
                </v-tab>
            </v-tabs>
        </template>
    </div>
</template>
