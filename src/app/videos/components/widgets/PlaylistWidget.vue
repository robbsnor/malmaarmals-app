<script setup lang="ts">
import Widget from './Widget.vue';
import { useVideoStore } from '../../stores/video.store.ts';
import VideoItem from '../VideoItem.vue';

const videoStore = useVideoStore();
</script>

<template>
    <Widget v-if="videoStore.playlist" title="Playlist">
        <div class="flex flex-col pt-4 gap-4">
            <VideoItem
                v-for="video in videoStore.playlist.videos"
                :key="video.video_id"
                :to="{ name: 'stream', params: { id: video.video_id }, query: { playlistId: videoStore.playlist.id } }"
                :video="video"
                :playlist="videoStore.playlist"
            >
            </VideoItem>
        </div>
    </Widget>
</template>
