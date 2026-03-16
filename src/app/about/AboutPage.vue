<script setup lang="ts">
import { computed, ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../video/stores/videos.store';

TitleHelper.setTitle('about');
const videosStore = useVideosStore();

const faqs = ref([
    {
        question: 'Why only 720p60?',
        answer: "I don't have the storage capacity for higher resolution videos. This is sufficient enough to preserve quality while minimizing storage requirements.",
    },
    {
        question: 'Why are the loading times so long?',
        answer: 'This website is partially self-hosted, meaning if many people use it at the same time, it can slow down.',
    },
    {
        question: 'A video or chat is missing, will you add it?',
        answer: 'If a video or chat is missing, please open a GitHub issue.',
    },
]);
</script>

<template>
    <div>
        <Container width="920px " class="py-4">
            <div class="fs">
                <h2>About Malmaarmals</h2>
                <p>
                    Malmaarmals is a website to archive and showcase old Twitch streams from the duo from Lekker Spelen.
                </p>

                <h2>F.A.Q.</h2>
                <v-expansion-panels>
                    <v-expansion-panel v-for="q in faqs" :key="q.question" :title="q.question" :text="q.answer">
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </Container>

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
                        class="aspect-square rounded transition-all"
                        :class="[video.chapters.length ? 'bg-green-500 hover:bg-green-300' : ' bg-black-400']"
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
