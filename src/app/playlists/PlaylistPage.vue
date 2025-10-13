<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { supabase } from '../../supabase';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';
import { BucketHelper } from '../shared/helpers/bucket.helper';
import VideoItem from '../videos/components/VideoItem.vue';
import type { Tables } from '../shared/types/database.types';

TitleHelper.setTitle('videos');

const playlistStore = usePlaylistsStore();
const id = useRouteParams('id') as Ref<string>;
const playlist = playlistStore.getPlaylistById(id);

const daysAgo = (video: Tables<'videos'>) => {
    const recordedAt = new Date(video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
</script>

<template>
    <Container :padding="false">
        <div class="relative overflow-hidden flex flex-col items-stretch justify-end aspect-[16/6]">
            <img
                :src="BucketHelper.getThumbnailUrl(Number(playlist?.playlist_videos[0]?.video_id))"
                alt=""
                class="absolute w-full h-full object-cover object-center"
            />
            <div class="absolute inset-0 bg-linear-to-b from-black/20 to-black-200"></div>

            <div class="relative border-b border-black-500 p-4">
                <h1 class="font-bold text-2xl">{{ playlist?.title }}</h1>
                <div class="text-muted">{{ playlist?.description }}</div>
            </div>
        </div>
    </Container>

    <Container>
        <div>
            <div class="flex flex-col gap-4 py-4">
                <RouterLink
                    :to="`/videos/${video.video_id}`"
                    class="flex gap-4"
                    v-for="video in playlist?.playlist_videos"
                    :key="video.id"
                >
                    <VideoThumbnail class="w-32 shrink-0" :src="BucketHelper.getThumbnailUrl(video.video_id)" />

                    <div>
                        <h2 class="font-bold text-md">
                            {{ video.title }}
                        </h2>
                        <p class="text-muted-more text-sm font-medium">{{ daysAgo(video) }} days ago</p>
                    </div>
                </RouterLink>
            </div>
        </div>
    </Container>
</template>
