<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useAppStore } from '../shared/stores/app.store';
import Video from '../shared/components/Video.vue';

const appStore = useAppStore();
const { videos } = storeToRefs(appStore);
</script>

<template>
    <Container>
        <div v-if="videos" class="grid grid-cols-5 items-center gap-8">
            <Video v-for="video in videos" :key="video.video_id" :video="video" />
        </div>
    </Container>
</template>
