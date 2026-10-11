<script setup lang="ts">
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <Transition name="fade">
        <img
            v-if="videoStore.casting"
            :src="BucketHelper.getThumbnailUrl(Number(videoStore.id))"
            alt=""
            class="absolute inset-0 w-full h-full object-contain"
            :class="videoStore.theaterMode ? '' : 'max-h-[82vh]'"
        />
    </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
