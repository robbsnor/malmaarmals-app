<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useArchiveStore } from '../archive/stores/archive.store';
import { useVideosStore } from '../videos/stores/videos.store';
import CategoryCard from './components/CategoryCard.vue';
import FilterIndicator from '../archive/components/FilterIndicator.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

TitleHelper.setTitle('games');

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const router = useRouter();

const INITIAL = 40;
const STEP = 40;
const count = ref(INITIAL);
const showAll = ref(false);

const hasMore = computed(() => count.value < filteredCategories.value.length);
const remaining = computed(() => Math.min(STEP, filteredCategories.value.length - count.value));

const filteredCategories = computed(() => {
    if (!archiveStore.debouncedQuery) return videosStore.populairCategories;
    const query = archiveStore.debouncedQuery.toLowerCase();
    return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query));
});

const visibleCategories = computed(() =>
    showAll.value ? filteredCategories.value : filteredCategories.value.slice(0, count.value)
);

function selectCategory(title: string) {
    archiveStore.query = title;
    router.push({ name: 'streams' });
}

function loadMore() {
    count.value += STEP;
}

// reset view whenever the search changes
watch(
    () => archiveStore.debouncedQuery,
    () => {
        showAll.value = false;
        count.value = INITIAL;
    }
);
</script>

<template>
    <Section
        title="Games"
        :more-text="!showAll && hasMore ? `Show more` : undefined"
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
                v-auto-animate
                class="grid grid-cols-3 gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8"
            >
                <CategoryCard
                    v-for="cat in visibleCategories"
                    :key="cat.id"
                    v-bind="cat"
                    @click="selectCategory(cat.title)"
                />
            </div>
        </template>

        <Empty v-else title="No categories found" description="Try something else." icon="mdi-magnify">
            <v-btn variant="text" color="primary" @click="archiveStore.resetQuery">Show all</v-btn>
        </Empty>
    </Section>
</template>
