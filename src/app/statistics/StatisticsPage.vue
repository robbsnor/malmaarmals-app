<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useVideosStore } from '../video/stores/videos.store';
import { useArchiveStore } from '../archive/stores/archive.store';
import GameCard from '../home/components/GameCard.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

TitleHelper.setTitle('statistics');

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const router = useRouter();

const STEP = 50;
const count = ref(30);
const query = ref('');

const filtered = computed(() => {
    if (!query.value) return videosStore.populairCategories;
    const q = query.value.toLowerCase();
    return videosStore.populairCategories.filter((cat) => cat.title.toLowerCase().includes(q));
});

// reset pagination whenever the search changes
watch(query, () => (count.value = STEP));

const displayed = computed(() => filtered.value.slice(0, count.value));
const hasMore = computed(() => count.value < filtered.value.length);
const remaining = computed(() => Math.min(STEP, filtered.value.length - count.value));

function selectCategory(title: string) {
    archiveStore.query = title;
    router.push('/archive?type=streams');
}
</script>

<template>
    <div>
        <Section title="Categories">
            <template #actions>
                <div class="flex items-center gap-4">
                    <div class="text-muted-more font-bold whitespace-nowrap">
                        {{ filtered.length }} categorie{{ filtered.length === 1 ? '' : 's' }}
                    </div>
                    <v-text-field
                        v-model="query"
                        class="max-w-[200px] w-[999px]"
                        placeholder="Search..."
                        density="compact"
                        variant="solo"
                    >
                    </v-text-field>
                </div>
            </template>

            <div
                class="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-3 lg:gap-4"
            >
                <GameCard v-for="cat in displayed" :key="cat.id" v-bind="cat" @click="selectCategory(cat.title)" />
            </div>

            <div v-if="hasMore" class="mt-6 flex justify-center">
                <button
                    class="px-6 py-2 rounded-full border border-primary/30 text-muted text-sm font-semibold hover:border-primary hover:text-primary transition-all duration-200"
                    @click="count += STEP"
                >
                    Show {{ remaining }} more
                </button>
            </div>
        </Section>
    </div>
</template>
