<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import Section from './Section.vue';

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
    <Section :show-top-fade="false">
        <Container class="flex justify-center">
            <div class="grid grid-cols-2 items-center gap-10 max-w-5/6">
                <div class="relative">
                    <img
                        aria-hidden="true"
                        :src="`http://192.168.2.41:8000/thumbnails/${props.video.video_id}`"
                        class="pointer-events-none absolute -z-10 aspect-video scale-300 rounded-[99%] object-cover opacity-20 blur-md select-none"
                    />
                    <VideoThumbnail
                        :to="`/videos/${props.video.video_id}`"
                        :src="`http://192.168.2.41:8000/thumbnails/${props.video.video_id}`"
                        border-radius="rounded-2xl"
                        class="w-full rounded-4xl shadow-[0_0_150px_rgba(0,0,0,1)] transition-all"
                    />
                </div>

                <div>
                    <!-- <div class="flex items-center gap-2 font-bold text-text-muted-more text-shadow-md">
                        <div class="text-sm italic">({{ getTimeAgo(props.video.recorded_at) }})</div>
                    </div> -->

                    <!-- <v-date-picker></v-date-picker> -->

                    <UBadge color="primary" variant="subtle" class="mb-1">Latest Stream</UBadge>

                    <div class="pt-2 text-5xl font-bold leading-[1.2]">
                        {{ props.video.title }}
                    </div>

                    <div class="font-bold text-text-muted text-xl">
                        {{ truncateStringArray(['Super Mario Kart World', 'Just Chatting'], 9999) }}
                    </div>

                    <div class="flex gap-4 pt-6">
                        <v-btn :to="`/videos/${props.video.video_id}`">Watch now</v-btn>
                    </div>
                </div>
            </div>
        </Container>
    </Section>
</template>
