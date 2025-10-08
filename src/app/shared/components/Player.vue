<script setup lang="ts">
import { onMounted, useAttrs, useTemplateRef } from 'vue';
import { useVideoStore } from '../../video/stores/video.store';

const attrs = useAttrs();
const videoStore = useVideoStore();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

onMounted(() => {
    videoStore.setVideoRef(videoRef.value);
});
</script>

<template>
    <div class="relative lg:rounded-md">
        <video v-bind="attrs" controls class="aspect-video w-full" ref="videoRef" :src="videoStore.videoSrc"></video>
    </div>
</template>
