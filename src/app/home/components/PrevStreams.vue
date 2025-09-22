<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import Video from '../../shared/components/Video.vue';

const props = withDefaults(
    defineProps<{
        videos: Tables<'videos'>[];
    }>(),
    {}
);
</script>

<template>
    <Section title="Previous Streams">
        <div class="grid grid-cols sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            <Video v-for="video in props.videos" :key="video.video_id" :video="video" />
        </div>
    </Section>
</template>
