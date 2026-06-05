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
    'Chat replay with full emote support',
    'Accurate chapters and timestamps',
    'Statistics for chat and games played',
    'Subscriber-only access for Lekker Spelen Twitch subscribers',
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
        <Section width="920px" title="About Malmaarmals" description="The Lekker Spelen Twitch archive.">
            <div class="fs">
                <p>
                    Aims to be an archive website to archive lost media from the old and new Twitch streams of Lekker
                    Spelen.
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
                <p>
                    <v-expansion-panels>
                        <v-expansion-panel v-for="q in faqs" :key="q.question" :title="q.question">
                            <v-expansion-panel-text>
                                <div v-html="q.answer"></div>
                            </v-expansion-panel-text>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </p>

                <p class="italic">
                    If Lekker Spelen wants this project to be offline, I'll gladly do so. Contact me via
                    <a href="https://www.twitch.tv/robbsnor/" target="_blank">Twitch</a> or
                    <a :href="githubRepoUrl" target="_blank">GitHub</a>
                </p>
            </div>
        </Section>
    </div>
</template>
