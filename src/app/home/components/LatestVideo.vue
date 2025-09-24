<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';

const props = withDefaults(
    defineProps<{
        video: Tables<'videos'>;
    }>(),
    {}
);

const daysAgo = (date: string) => {
    const recordedDate = new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

function truncateStringArray(titles: string[], maxLength: number = 20): string {
    return titles
        .map((title) => (title.length > maxLength ? title.slice(0, maxLength).trim() + '...' : title))
        .join(', ');
}

const getTimeAgo = (date: string) => {
    const recorded = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - recorded.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);

    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);

    return `${diffDays} days ago`;
};
</script>

<template>
    <Container>
        <div class="relative flex flex-col gap-4 py-40 lg:flex-row lg:gap-8 lg:items-center xl:max-w-4/5 xl:mx-auto">
            <div class="relative flex-1">
                <img
                    aria-hidden="true"
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    class="pointer-events-none absolute aspect-video scale-300 rounded-[99%] object-cover opacity-20 blur-md select-none"
                />
                <VideoThumbnail
                    type="large"
                    :to="`/videos/${props.video.video_id}`"
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    :icon-size="60"
                >
                    <div class="absolute top-4 right-4">
                        <!-- <v-chip color="secondary" variant="elevated">Latest Video</v-chip> -->
                    </div>
                </VideoThumbnail>
            </div>

            <div class="z-10 flex-1">
                <!-- <div class="flex items-center gap-2 font-bold text-text-muted-more text-shadow-md">
                        <div class="text-sm italic">({{ getTimeAgo(props.video.recorded_at) }})</div>
                    </div> -->

                <div class="text-3xl md:text-4xl font-bold leading-[1.2]">
                    {{ props.video.title }}
                </div>

                <div class="text-md font-bold text-text-muted md:text-xl">
                    {{ truncateStringArray(['Super Mario Kart World', 'Just Chatting'], 9999) }}
                </div>

                <div class="flex gap-4 pt-4">
                    <v-btn :to="`/videos/${props.video.video_id}`" variant="flat" color="primary">Watch now</v-btn>
                </div>
            </div>
        </div>
    </Container>
</template>
