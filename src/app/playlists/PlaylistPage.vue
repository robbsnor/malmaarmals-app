<script setup lang="ts">
import { computed, onMounted, ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { supabase } from '../../supabase';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';
import { BucketHelper } from '../shared/helpers/bucket.helper';
import VideoItem from '../video/components/VideoItem.vue';
import DeletePlaylistDialog from './components/DeletePlaylistDialog.vue';
import type { Tables } from '../shared/types/database.types';
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
    <Container v-if="playlist" :padding="false">
        <div class="relative overflow-hidden aspect-[16/6]">
            <img
                :src="BucketHelper.getThumbnailUrl(Number(playlist?.playlist_videos[0]?.video_id))"
                alt=""
                class="absolute w-full h-full object-cover object-center"
            />
            <div class="absolute inset-0 bg-linear-to-b from-black/50 to-black-100"></div>

            <div class="p-4 flex justify-between gap-4">
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

            <div class="absolute bottom-0 border-b border-black-500 p-4 w-full">
                <h1 class="font-bold text-2xl">{{ playlist.title }}</h1>
                <div class="text-muted">{{ playlist.description }}</div>
            </div>
        </div>
    </Container>

    <Container>
        <div>
            <div class="flex flex-col gap-4 py-4">
                <RouterLink
                    v-for="video in playlist?.playlist_videos"
                    :key="video.id"
                    :to="{ name: 'video', params: { id: video.video_id } }"
                    class="flex gap-4"
                >
                    <VideoThumbnail
                        class="w-32 shrink-0"
                        :src="BucketHelper.getThumbnailUrl(video.video_id)"
                        :durationS="video.length_sec"
                    />

                    <div>
                        <h2 class="font-bold text-md">
                            {{ video.title }}
                        </h2>
                        <div class="text-muted-more text-sm font-medium">{{ daysAgo(video) }} days ago</div>
                    </div>
                </RouterLink>
            </div>
        </div>
    </Container>
</template>
