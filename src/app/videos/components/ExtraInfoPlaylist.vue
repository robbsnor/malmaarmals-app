<script setup lang="ts">
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import Thumbnail from '../../shared/components/Thumbnail.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';
import VideoItem from './VideoItem.vue';

const videoStore = useVideoStore();
</script>

<template>
    <ExtraInfoItem v-if="videoStore.playlist" title="Playlist">
        <div class="flex flex-col max-h-[800px] overflow-y-auto -4">
            <VideoItem
                class="px-4 py-2 hover:bg-black-400 transition-all"
                v-for="video in videoStore.playlist.videos"
                :key="video.video_id"
                :to="{ name: 'stream', params: { id: video.video_id }, query: { playlistId: videoStore.playlist.id } }"
                :video="video"
                :responsive="false"
            >
            </VideoItem>
        </div>
    </ExtraInfoItem>
</template>
