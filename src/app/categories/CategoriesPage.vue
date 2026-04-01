<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useArchiveStore } from '../archive/stores/archive.store';
import { useVideosStore } from '../videos/stores/videos.store';
import CategoryCardLarge from './components/CategoryCardLarge.vue';
import FilterIndicator from '../archive/components/FilterIndicator.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useDisplay } from 'vuetify';
import CategoryCard from './components/CategoryCard.vue';

TitleHelper.setTitle('games');

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const router = useRouter();
const { lgAndUp } = useDisplay();

const INITIAL = 40;
const STEP = 200;
const count = ref(INITIAL);
const showAll = ref(false);

const hasMore = computed(() => count.value < filteredCategories.value.length);

const filteredCategories = computed(() => {
    if (!archiveStore.debouncedQuery) return videosStore.populairCategories;
    const query = archiveStore.debouncedQuery.toLowerCase();
    return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query));
});

const visibleCategories = computed(() =>
    showAll.value ? filteredCategories.value : filteredCategories.value.slice(0, count.value)
);

function selectCategory(title: string) {
    router.push({ name: 'streams' });
    archiveStore.query = title;
}

function loadMore() {
    count.value += STEP;
}
</script>

<template>
    <Section
        title="Games"
        :more-text="!showAll && hasMore ? `Show more` : undefined"
        :show-header="lgAndUp"
        more-icon="mdi-chevron-down"
        v-on="!showAll && hasMore ? { moreClick: loadMore } : {}"
    >
        <template #actions>
            <div class="flex justify-center gap-2 items-center max-lg:hidden">
                <v-icon
                    v-if="hasMore"
                    color="grey"
                    class="text-muted-more!"
                    :icon="showAll ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                    @click="showAll = !showAll"
                >
                </v-icon>

                <div class="text-muted-more font-bold whitespace-nowrap">
                    {{ videosStore.populairCategories.length }} games
                </div>
            </div>
        </template>

        <FilterIndicator archiveType="GAMES" :total-results="filteredCategories.length" />

        <template v-if="filteredCategories.length">
            <div
                v-if="lgAndUp"
                v-auto-animate
                class="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
            >
                <CategoryCardLarge
                    v-for="cat in visibleCategories"
                    :key="cat.id"
                    v-bind="cat"
                    @click="selectCategory(cat.title)"
                />
            </div>

            <div v-else v-auto-animate class="flex flex-col gap-4">
                <CategoryCard
                    v-for="cat in visibleCategories"
                    :key="cat.id"
                    v-bind="cat"
                    :to="{ name: 'streams' }"
                    @click="selectCategory(cat.title)"
                />
            </div>
        </template>

        <Empty v-else title="No games found..." description="Try something else." icon="mdi-controller">
            <v-btn variant="tonal" color="primary" @click="archiveStore.resetQuery">Clear filter</v-btn>
        </Empty>
    </Section>
</template>
