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

const INITIAL = 20;
const STEP = 50;
const count = ref(INITIAL);
const showAll = ref(false);
const query = ref('');

const filtered = computed(() => {
    if (!query.value) return videosStore.populairCategories;
    const q = query.value.toLowerCase();
    return videosStore.populairCategories.filter((cat) => cat.title.toLowerCase().includes(q));
});

const displayed = computed(() => (showAll.value ? filtered.value : filtered.value.slice(0, count.value)));
const hasMore = computed(() => count.value < filtered.value.length);
const remaining = computed(() => Math.min(STEP, filtered.value.length - count.value));

function selectCategory(title: string) {
    archiveStore.query = title;
    router.push('/streams');
}

function loadMore() {
    count.value += STEP;
}

// reset view whenever the search changes
watch(query, () => {
    showAll.value = false;
    count.value = INITIAL;
});

const amountToShow = ref(50);

const filteredCategories = computed(() => {
    if (!archiveStore.query) return videosStore.populairCategories;

    const query = archiveStore.query.toLowerCase();
    return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query));
});

function openCategory(title: string) {
    archiveStore.query = title;
    router.push({ name: 'streams' });
}
</script>

<template>
    <div class="pt-4 px-4">
        <FilterIndicator archiveType="GAMES" :total-results="filteredCategories.length" />

        <Section
            title="Categories"
            :more-text="!showAll && hasMore ? `Show ${remaining} more` : undefined"
            more-icon="mdi-chevron-down"
            v-on="!showAll && hasMore ? { moreClick: loadMore } : {}"
        >
            <template #actions>
                <div class="flex justify-center gap-2 items-center py-4 max-lg:hidden">
                    <v-icon
                        v-if="hasMore"
                        color="grey"
                        class="text-muted-more!"
                        :icon="showAll ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                        @click="showAll = !showAll"
                    >
                    </v-icon>

                    <div class="text-muted-more font-bold whitespace-nowrap">
                        {{ videosStore.populairCategories.length }} categories
                    </div>
                </div>
            </template>

            <template v-if="filtered.length">
                <div
                    v-auto-animate
                    class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3 lg:gap-4"
                >
                    <CategoryCard
                        v-for="cat in displayed"
                        :key="cat.id"
                        v-bind="cat"
                        @click="selectCategory(cat.title)"
                    />
                </div>
            </template>

            <Empty v-else title="No categories found" description="Try something else." icon="mdi-magnify" />
        </Section>
    </div>
</template>
