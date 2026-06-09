<script setup lang="ts">
import { useVideosStore } from '../../videos/stores/videos.store';

const videosStore = useVideosStore();
</script>

<template>
    <Section
        title="Chapters overview"
        description="An overview of streams that have chapters. PETER vs TIMON and similar streams don't have chapters to prevent spoilers."
    >
        <template #actions>
            <div class="text-muted">
                {{ videosStore.videos.filter((v) => v.chapters.length).length }} /
                {{ videosStore.videos.length }}
            </div>
        </template>

        <div class="grid grid-cols-[repeat(auto-fit,minmax(18px,1fr))] gap-1.5">
            <RouterLink
                v-for="video in videosStore.videos"
                :key="video.id"
                :to="{ name: 'stream', params: { id: video.video_id } }"
                class="aspect-square rounded transition-afll hover:brightness-150"
                :class="[
                    !video.chapters.length && 'bg-black-400',
                    video.chapters?.length === 1 && 'bg-[#033a16]',
                    video.chapters?.length === 2 && 'bg-[#196c2e]',
                    video.chapters?.length === 3 && 'bg-[#2ea043]',
                    video.chapters?.length >= 4 && 'bg-[#56d364]',
                ]"
            >
            </RouterLink>
        </div>
    </Section>
</template>
