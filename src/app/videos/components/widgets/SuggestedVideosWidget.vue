<script setup lang="ts">
import Widget from './Widget.vue';
import { useVideosStore } from '../../stores/videos.store';
import { useVideoStore } from '../../stores/video.store';
import { computed } from 'vue';
import VideoItem from '../VideoItem.vue';

const videosStore = useVideosStore();
const videoStore = useVideoStore();

function jaccard(a, b) {
    const shared = [...a].filter((x) => b.has(x)).length;
    const union = new Set([...a, ...b]).size;
    return union ? shared / union : 0;
}
// prettier-ignore
const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "on", "for", "with", "how", "is", "at", "by",
]);

const gameSet = (v) => new Set((v.games ?? []).map((g) => g.toLowerCase().trim()));

function tokenize(title) {
    return new Set(
        title
            .toLowerCase()
            .replace(/[^\p{L}\p{N}\s]/gu, '')
            .split(/\s+/)
            .filter((w) => w && !STOP_WORDS.has(w))
    );
}

const relatedVideos = computed(() => {
    if (!videoStore.video) return;
    const W_GAMES = 0.9;
    const W_TITLE = 0.1;

    const selTitle = tokenize(videoStore.video.title);
    const selGames = gameSet(videoStore.video.chapters.map((c) => c.category.title));

    return videosStore.videos
        .filter((v) => v.id !== videoStore.video.id)
        .map((v) => ({
            video: v,
            score: W_GAMES * jaccard(selGames, gameSet(v)) + W_TITLE * jaccard(selTitle, tokenize(v.title)),
        }))
        .filter((r) => r.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((r) => r.video);
});
</script>

<template>
    <Widget v-if="relatedVideos.length" title="Suggested streams">
        <div class="flex flex-col pt-4 gap-4">
            <VideoItem
                v-for="video in relatedVideos"
                :key="video.video_id"
                :to="{ name: 'stream', params: { id: video.video_id } }"
                :video="video"
            >
            </VideoItem>
        </div>
    </Widget>
</template>
