<script setup lang="ts">
import Stats from '../../app/home/components/Stats.vue';
import Playlists from './components/Playlists.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import RecentStreams from './components/RecentStreams.vue';
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

        <Container class="flex items-center justify-center flex-col pt-18 pb-8 lg:pt-20 lg:pb-12">
            <Logo payoff class="relative z-1 w-[80%] lg:w-150" />
        </Container>

        <RecentStreams />
        <Playlists />
        <!-- <History /> -->

        <Auth>
            <Section title="Chapters overview">
                <template #actions>
                    <div class="text-muted">
                        {{ videosStore.videos.filter((v) => v.chapters.length).length }} /
                        {{ videosStore.videos.length }}
                    </div>
                </template>

                <div class="grid grid-cols-[repeat(auto-fit,minmax(20px,1fr))] gap-1.5">
                    <RouterLink
                        v-for="video in videosStore.videos"
                        :key="video.id"
                        :to="{ name: 'video', params: { id: video.video_id } }"
                        class="aspect-square rounded"
                        :class="[video.chapters.length ? 'bg-green-500' : ' bg-black-400']"
                    ></RouterLink>

                    <!-- <v-menu
                        v-for="video in videosStore.videos"
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
                    </v-menu> -->
                </div>
            </Section>
        </Auth>
    </div>
</template>
