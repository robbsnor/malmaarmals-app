<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

onMounted(() => {
    videoStore.setVideoRef(videoRef.value);
});
</script>

<template>
    <div class="relative lg:rounded-md">
        <video controls class="aspect-video w-full" ref="videoRef" :src="videoStore.videoSrc"></video>
    </div>
    {{ videoStore.mediaControls.playing }}
    {{ videoStore.mediaControls.currentTime }}
    {{ videoStore.mediaControls.duration }}
</template>
