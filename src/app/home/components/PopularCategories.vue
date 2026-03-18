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
    <Section title="Popular games" :more-text="`All games`" :more-link="{ name: 'games' }">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.populairCategories.length }} categories</div>
        </template>

        <div class="grid grid-cols-3 gap-3 md:grid-cols-4 lg:gap-8 xl:grid-cols-4 2xl:grid-cols-8">
            <CategoryCard v-for="cat in preview" :key="cat.id" v-bind="cat" @click="selectCategory(cat.title)" />
        </div>
    </Section>
</template>
