<script setup lang="ts">
import VideoItem from '../../video/components/VideoItem.vue';
import VideoItemLarge from '../../video/components/VideoItemLarge.vue';
import { useVideosStore } from '../../video/stores/videos.store';
import { computed } from 'vue';

const videosStore = useVideosStore();
</script>

<template>
    <Section title="Streams" moreLink="/archive?type=streams" moreText="All Streams">
        <template v-if="videosStore.videos.length">
            <div class="flex flex-col gap-5 lg:hidden">
                <VideoItem v-for="video in videosStore.videos.slice(0, 5)" :key="video.video_id" :video="video" />
            </div>

            <div class="grid gap-x-4 gap-y-8 grid-cols-4 xl:gap-8">
                <VideoItemLarge
                    v-for="video in videosStore.videos.slice(0, 8)"
                    :key="video.video_id"
                    class="max-lg:hidden"
                    :video="video"
                />
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
