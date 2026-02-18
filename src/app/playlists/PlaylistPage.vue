<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { supabase } from '../../supabase';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';
import { BucketHelper } from '../shared/helpers/bucket.helper';
import VideoItem from '../video/components/VideoItem.vue';
import DeletePlaylistDialog from './components/DeletePlaylistDialog.vue';
import type { Tables } from '../shared/models/database.types';
import { useAuthStore } from '../auth/stores/auth.store';

TitleHelper.setTitle('videos');

const playlistStore = usePlaylistsStore();
const authStore = useAuthStore();
const id = useRouteParams('id') as Ref<string>;
const playlist = playlistStore.getPlaylistById(id);

const daysAgo = (video: Tables<'videos'>) => {
    const recordedAt = new Date(video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
const dialog = ref(false);
</script>

<template>
    <Container :padding="false">
        <div class="relative overflow-hidden max-md:aspect-video md:h-[500px]">
            <img
                v-if="playlist.videos.length"
                :src="BucketHelper.getThumbnailUrl(Number(playlist.videos[0].video_id))"
                alt=""
                class="absolute h-full w-full object-cover object-center"
            />
            <div class="to-black-100 absolute inset-0 bg-linear-to-b from-black/50"></div>

            <div class="flex justify-between gap-4 p-4">
                <v-btn
                    :to="{ name: 'archive', query: { type: 'playlists' } }"
                    variant="tonal"
                    prependIcon="mdi-chevron-left"
                >
                    Playlists
                </v-btn>

                <Auth>
                    <v-btn
                        variant="tonal"
                        icon="mdi-trash-can-outline"
                        color="error"
                        size="x-small"
                        class="cursor-pointer"
                        @click="dialog = true"
                    />
                    <DeletePlaylistDialog :playlist="playlist" v-model="dialog" />
                </Auth>
            </div>

            <div class="absolute bottom-0 w-full p-4 pb-0">
                <h1 class="text-2xl font-bold">{{ playlist.title }}</h1>
                <div class="text-muted">{{ playlist.description }}</div>
            </div>
        </div>
    </Container>

    <Container>
        <div>
            <div class="flex flex-col gap-4 py-4">
                <RouterLink
                    v-for="video in playlist?.videos"
                    :key="video.id"
                    :to="{ name: 'video', params: { id: video.video_id }, query: { playlistId: playlist.id } }"
                    class="flex gap-4"
                >
                    <VideoThumbnail
                        class="w-36 shrink-0"
                        :src="BucketHelper.getThumbnailUrl(video.video_id)"
                        :videoId="video.video_id"
                        :durationS="video.length_sec"
                    />

                    <div>
                        <h2 class="text-md line-clamp-2 font-bold">
                            {{ video.title }}
                        </h2>
                        <div class="text-muted-more text-sm font-medium">{{ daysAgo(video) }} days ago</div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </Container>
</template>
