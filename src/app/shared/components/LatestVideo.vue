<script setup lang="ts">
import Container from './Container.vue';

const props = withDefaults(
    defineProps<{
        video: any;
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
    <Container class="flex justify-center py-20">
        <div class="grid grid-cols-2 items-center gap-10 max-w-5/6">
            <div class="relative">
                <img
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    class="pointer-events-none absolute -z-10 aspect-video scale-200 overflow-hidden rounded-[99%] object-cover opacity-20 blur-2xl select-none"
                />
                <img
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    class="aspect-video w-full rounded-4xl shadow-[0_0_150px_rgba(0,0,0,1)] transition-all"
                />
            </div>

            <div class="z-10">
                <div class="flex items-center gap-2 font-bold text-text-muted-more text-shadow-md">
                    <div>Latest stream</div>
                    <div class="text-sm italic">({{ getTimeAgo(props.video.recorded_at) }})</div>
                </div>

                <div class="pt-2 text-5xl font-bold">
                    {{ props.video.title }}
                </div>

                <div class="font-bold text-text-muted text-xl">
                    {{ truncateStringArray(['Mario Kart World', 'Just Chatting']) }}
                </div>
            </div>
        </div>
    </Container>
</template>
