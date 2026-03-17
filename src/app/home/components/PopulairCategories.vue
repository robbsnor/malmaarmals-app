<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useVideosStore } from '../../videos/stores/videos.store';
import { useArchiveStore } from '../../archive/stores/archive.store';
import CategoryCard from '../../categories/components/CategoryCard.vue';

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const router = useRouter();

const preview = computed(() => videosStore.populairCategories.slice(0, 8));

function selectCategory(title: string) {
    archiveStore.query = title;
    router.push({ name: 'streams' });
}
</script>

<template>
    <Section title="Populair Categories" :more-text="`All categories`" :more-link="{ name: 'games' }">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.populairCategories.length }} categories</div>
        </template>

        <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 lg:gap-8">
            <CategoryCard v-for="cat in preview" :key="cat.id" v-bind="cat" @click="selectCategory(cat.title)" />
        </div>
    </Section>
</template>
