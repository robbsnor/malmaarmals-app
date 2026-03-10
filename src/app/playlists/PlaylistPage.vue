<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';
import { BucketHelper } from '../shared/helpers/bucket.helper';
import VideoItem from '../video/components/VideoItem.vue';
import VideoItemLarge from '../video/components/VideoItemLarge.vue';
import DeletePlaylistDialog from './components/DeletePlaylistDialog.vue';

TitleHelper.setTitle('videos');

const playlistStore = usePlaylistsStore();
const id = useRouteParams('id') as Ref<string>;
const playlist = playlistStore.getPlaylistById(id);
const dialog = ref(false);
</script>

<template>
    <div>
        <Container :padding="false">
            <div class="relative overflow-hidden max-md:aspect-video md:h-[500px] 3xl:rounded-t-2xl 3xl:mt-8">
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

                <div class="absolute bottom-0 w-full p-4">
                    <h1 class="text-2xl font-bold">{{ playlist.title }}</h1>
                    <div class="text-muted">{{ playlist.description }}</div>
                </div>
            </div>
        </Container>

        <Container>
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" v-auto-animate>
                <template v-for="video in playlist.videos" :key="video.video_id">
                    <VideoItem :video="video" :playlist="playlist" />
                    <VideoItemLarge :video="video" :playlist="playlist" />
                </template>
            </div>
        </Container>
    </div>
</template>
