<script setup lang="ts">
import { computed, ref } from 'vue';

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
    <Container width="600px">
        <div class="fs">
            <h2>About Malmaarmals</h2>
            <p>Malmaarmals is a website to archive and showcase old Twitch streams from the duo from Lekker Spelen.</p>

            <h2>F.A.Q.</h2>
            <v-expansion-panels>
                <v-expansion-panel v-for="q in faqs" :key="q.question" :title="q.question" :text="q.answer">
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </Container>
</template>
