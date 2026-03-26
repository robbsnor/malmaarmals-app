<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVideosStore } from '../../videos/stores/videos.store';
import { useArchiveStore } from '../../archive/stores/archive.store';
import CategoryCardLarge from '../../categories/components/CategoryCardLarge.vue';
import CategoryCard from '../../categories/components/CategoryCard.vue';
import { useDisplay } from 'vuetify';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const router = useRouter();
const { mdAndUp, lgAndUp, xlAndUp } = useDisplay();

const amount = computed(() => {
    if (mdAndUp.value) return 8;
    return 9;
});

function selectCategory(title: string) {
    archiveStore.query = title;
    router.push({ name: 'streams' });
}
</script>

<template>
    <Section title="Most played games" :more-text="`All games`" :more-link="{ name: 'games' }">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.populairCategories.length }} games</div>
        </template>

        <div v-if="lgAndUp" class="grid grid-cols-3 gap-3 md:grid-cols-4 lg:gap-8 xl:grid-cols-8">
            <CategoryCardLarge
                v-for="cat in videosStore.populairCategories.slice(0, amount.value)"
                :key="cat.id"
                v-bind="cat"
                @click="selectCategory(cat.title)"
            />
        </div>
        <div v-else v-auto-animate class="flex flex-col gap-2">
            <CategoryCard
                v-for="cat in videosStore.populairCategories.slice(0, 5)"
                :key="cat.id"
                v-bind="cat"
                :to="{ name: 'streams' }"
                class="relative flex gap-3.5 overflow-hidden p-2 rounded-lg"
                @click="selectCategory(cat.title)"
            />
        </div>
    </Section>
</template>
