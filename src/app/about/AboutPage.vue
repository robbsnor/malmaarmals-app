<script setup lang="ts">
import { ref } from 'vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../videos/stores/videos.store';

TitleHelper.setTitle('about');
const videosStore = useVideosStore();
const githubRepoUrl = 'https://github.com/robbsnor/malmaarmals-app';

const features = [
    '99% of old and new Twitch streams archived',
    '98% of chat messages archived',
    'Chat replay with partial emote support',
    'Accurate chapters and timestamps',
    'Statistics for chat and games played',
    'Subscriber-only access for LekkerSpelen Twitch subscribers',
    'Custom playlists',
];

const faqs = ref([
    {
        question: 'Why is the video quality 720p60?',
        answer: 'Higher resolutions require significantly more storage and bandwidth. 720p60 keeps quality good while keeping the archive sustainable.',
    },
    {
        question: 'Why are the video loading times long?',
        answer: 'This website is partially self-hosted, so performance can slow down when many people are using it at the same time.',
    },
    {
        question: 'A video or chat is missing, will you add it?',
        answer: `Yes. But I don't have the data. If a stream or chat log is missing and you have it, open a <a href="${githubRepoUrl}" target="_blank" >GitHub issue or pull request</a>.`,
    },
    {
        question: 'Can I help improve this project?',
        answer: `Absolutely. Open an issue for ideas and create a pull request if you want to contribute data, fixes, or features on <a href="${githubRepoUrl}" target="_blank" >GitHub</a>.`,
    },
    {
        question: 'Why is malmaarmals not in Dutch?',
        answer: 'Nederlandstalige websites vind ik vies :lekkerRanzig:',
    },
]);
</script>

<template>
    <div>
        <Container width="920px" class="py-4">
            <div class="fs">
                <h2>About Malmaarmals</h2>
                <p>The LekkerSpelen Twitch archive.</p>
                <p>
                    Aims to be an archive website to archive lost media from the old and new Twitch streams of
                    LekkerSpelen.
                </p>

                <h2>Features</h2>
                <ul class="list-disc pl-5 text-muted space-y-1">
                    <li v-for="item in features" :key="item">{{ item }}</li>
                </ul>

                <p></p>
                <p class="italic">
                    Have more ideas?
                    <a :href="githubRepoUrl" target="_blank">Create an issue</a>
                </p>

                <h2>F.A.Q.</h2>
                <v-expansion-panels>
                    <v-expansion-panel v-for="q in faqs" :key="q.question" :title="q.question">
                        <v-expansion-panel-text>
                            <div v-html="q.answer"></div>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>

                <p class="mt-6">
                    Questions? Feel free to contact me through
                    <a :href="githubRepoUrl" target="_blank">GitHub </a>
                </p>

                <p class="italic">
                    If LekkerSpelen wants this project to be offline, I'll gladly do so. Contact me via
                    <a href="https://www.twitch.tv/robbsnor/" target="_blank">Twitch</a> or
                    <a :href="githubRepoUrl" target="_blank">GitHub</a>
                </p>
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
                        :to="{ name: 'stream', params: { id: video.video_id } }"
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
                                :to="{ name: 'stream', params: { id: video.video_id } }"
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
