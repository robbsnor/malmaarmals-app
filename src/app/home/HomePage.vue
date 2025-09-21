<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import Stats from '../../app/home/components/Stats.vue';
import Video from '../app/../shared/components/Video.vue';
import LatestVideo from './components/LatestVideo.vue';
import Playlists from './components/Playlists.vue';
import { useAppStore } from '../shared/stores/app.store';
import { TitleHelper } from '../shared/helpers/title.helper';
import { useVideosStore } from '../video/stores/videos.store';

TitleHelper.setTitle('Home');

const appStore = useAppStore();
const videosStore = useVideosStore();
const { videos } = storeToRefs(videosStore);

const number = ref(0);

const firstVideo = computed(() => videos?.value[number.value]);
const previousVideos = computed(() => videos?.value.slice(1, 6));

const handleArrow = (event: KeyboardEvent) => {
    if (!videos?.value) return;
    if (event.key === 'ArrowRight') {
        if (number.value < videos?.value.length - 1) {
            number.value++;
        }
    } else if (event.key === 'ArrowLeft') {
        if (number.value > 0) {
            number.value--;
        }
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleArrow);
});
</script>

<template>
    <div v-if="videos">
        <LatestVideo :video="firstVideo" />

        <Section title="Previous Streams">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in previousVideos" :key="video.video_id" :video="video" />
            </div>
        </Section>

        <Playlists />

        <Stats />

        <Section title="Populair Categories">
            <div class="grid grid-cols-5 gap-8">
                <Video v-for="video in previousVideos" :key="video.video_id" :video="video" />
            </div>
        </Section>
    </div>
</template>
