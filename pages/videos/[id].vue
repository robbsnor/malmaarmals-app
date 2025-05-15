<script setup lang="ts">
import { VIDEOS_MOCK } from '~/data/videos.mock'

const route = useRoute()

const videos = ref(VIDEOS_MOCK)
const video = computed(() => {
    return videos.value.find((video) => video.id.toString() === route.params.id)
})
</script>

<template>
    <div v-if="video">
        <NuxtLink to="/videos"> Back to videos </NuxtLink>
        <h2>Video ID</h2>
        {{ route.params.id }}
    </div>
</template>
