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
            <div class="flex flex-col gap-5 xl:hidden">
                <VideoItem v-for="video in videosStore.videos.slice(0, 5)" :key="video.video_id" :video="video" />
            </div>

            <div class="grid gap-8 grid-cols-4">
                <VideoItemLarge
                    v-for="video in videosStore.videos.slice(0, 8)"
                    :key="video.video_id"
                    class="max-xl:hidden"
                    :video="video"
                />
            </div>
        </template>

        <Empty v-else title="No streams found." icon="mdi-play" />
    </Section>
</template>
