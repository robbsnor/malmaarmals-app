<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { usePlaylistsStore } from '../playlists/stores/playlists.store';
import { useRouteParams } from '@vueuse/router';
import { BucketHelper } from '../shared/helpers/bucket.helper';
import VideoItem from '../video/components/VideoItem.vue';
import VideoItemLarge from '../video/components/VideoItemLarge.vue';
import DeletePlaylistDialog from './components/DeletePlaylistDialog.vue';
import { useAuthStore } from '../auth/stores/auth.store';

TitleHelper.setTitle('videos');

const playlistStore = usePlaylistsStore();
const id = useRouteParams('id') as Ref<string>;
const playlist = playlistStore.getPlaylistById(id);
const dialog = ref(false);
const authStore = useAuthStore();
</script>

<template>
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
        <div class="flex flex-col gap-5 lg:hidden">
            <VideoItem v-for="video in playlist?.videos" :key="video.video_id" :video="video">
                <template v-if="authStore.isAdmin" #actions>
                    <v-menu>
                        <template #activator="{ props }">
                            <v-btn
                                icon="mdi-dots-vertical"
                                variant="text"
                                size="small"
                                v-bind="props"
                                @click.prevent.stop
                            />
                        </template>

                        <v-list>
                            <v-list-item
                                class="text-red"
                                title="Delete"
                                prepend-icon="mdi-trash-can"
                                @click="playlistStore.deleteVideoFromPlaylist(video.id, playlist.id)"
                            />
                        </v-list>
                    </v-menu>
                </template>
            </VideoItem>
        </div>

        <div class="grid gap-x-4 gap-y-8 grid-cols-5 xl:gap-8 max-lg:hidden">
            <VideoItemLarge v-for="video in playlist?.videos" :key="video.video_id" :video="video" />
        </div>
    </Container>
</template>
