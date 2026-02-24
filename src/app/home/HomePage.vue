<script setup lang="ts">
import Stats from '../../app/home/components/Stats.vue';
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import PrevStreams from './components/PrevStreams.vue';
import History from './components/History.vue';
import { useAuthStore } from '../auth/stores/auth.store';
import { useVideoStore } from '../video/stores/video.store';
import { useVideosStore } from '../video/stores/videos.store';

TitleHelper.setTitle('home');
const authStore = useAuthStore();
const videosStore = useVideosStore();
</script>

<template>
    <div>
        <!-- <div>accessToken: {{ authStore.twitchAccessToken }}</div>
        <div>refreshToken: {{ authStore.twitchRefreshToken }}</div> -->
        <PrevStreams />
        <Playlists />
        <!-- <History /> -->

        <Auth>
            <Section title="Chapters overview">
                <div class="grid grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-1.5">
                    <v-menu
                        v-for="video in videosStore.chaptersOverview"
                        :key="video.id"
                        open-on-click
                        open-on-hover
                        open-delay="0"
                        close-delay="0"
                        location="top"
                    >
                        <template v-slot:activator="{ props }">
                            <RouterLink
                                v-bind="props"
                                :to="{ name: 'video', params: { id: video.video_id } }"
                                class="aspect-square rounded"
                                :class="[video.chapters.length ? 'bg-green-500' : ' bg-black-400']"
                            ></RouterLink>
                        </template>

                        <div class="bg-black-200 rounded border border-black-400 p-4">
                            <div>{{ video.title }}</div>
                        </div>
                    </v-menu>
                </div>
            </Section>
        </Auth>
    </div>
</template>
