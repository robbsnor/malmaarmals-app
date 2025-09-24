<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import Video from '../../shared/components/Video.vue';
import VideoSmall from '../../shared/components/VideoSmall.vue';

const props = withDefaults(
    defineProps<{
        videos: Tables<'videos'>[];
    }>(),
    {}
);
</script>

<template>
    <Section title="Previous Streams">
        <div class="hidden md:grid md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <Video v-for="video in props.videos" :key="video.video_id" :video="video" />
        </div>

        <div class="flex flex-col gap-4 md:hidden">
            <VideoSmall v-for="video in props.videos" :key="video.video_id" :video="video" />
        </div>

        <template #actions>
            <v-btn to="/videos" variant="text">view all</v-btn>
        </template>
    </Section>
</template>
