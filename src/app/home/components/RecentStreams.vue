<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/composables/display.mjs';
import VideoItem from '../../videos/components/VideoItem.vue';
import VideoItemLarge from '../../videos/components/VideoItemLarge.vue';
import { useVideosStore } from '../../videos/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
const { lgAndUp, xlAndUp } = useDisplay();

const amount = computed(() => {
    if (xlAndUp.value) return 10;
    if (lgAndUp.value) return 6;

    return 5;
});
</script>

<template>
    <Section title="Recent streams" moreLink="/streams" moreText="All Streams">
        <template #actions>
            <div class="text-muted-more font-bold">{{ videosStore.videos.length }} streams</div>
        </template>

        <template v-if="videosStore.videos.length">
            <div class="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5">
                <template v-for="video in videosStore.videos.slice(0, amount)" :key="video.video_id">
                    <VideoItem :video="video" />
                    <VideoItemLarge :video="video" />
                </template>
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
