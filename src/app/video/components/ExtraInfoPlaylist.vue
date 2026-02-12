<script setup lang="ts">
import VideoThumbnail from '../../shared/components/VideoThumbnail.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';

const videoStore = useVideoStore();
</script>

<template>
    <ExtraInfoItem v-if="videoStore.playlist" title="Playlist">
        <div class="flex flex-col gap-4">
            <RouterLink
                v-for="video in videoStore.playlist.videos"
                :key="video.video_id"
                :to="{ name: 'video', params: { id: video.video_id }, query: { playlistId: videoStore.playlist.id } }"
                class="flex flex-nowrap gap-4"
            >
                <div class="w-30 grow-0">
                    <VideoThumbnail
                        :src="BucketHelper.getThumbnailUrl(video.video_id)"
                        :alt="video.title"
                        :video-id="video.video_id"
                    />
                </div>
                <div>
                    <div>{{ video.title }}</div>
                    <div v-if="video.description">{{ video.description }}</div>
                    <div>{{ video.video_id }}</div>
                </div>
            </RouterLink>
        </div>
    </ExtraInfoItem>
</template>
