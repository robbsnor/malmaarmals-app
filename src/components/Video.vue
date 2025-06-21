<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        video: any;
        isFirst?: boolean;
    }>(),
    {
        isFirst: false,
    }
);

const daysAgo = computed(() => {
    const recordedAt = new Date(props.video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const formattedDuration = computed(() => {
    const duration = props.video.length_sec;
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    if (hours > 0) {
        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
});
</script>

<template>
    <RouterLink
        :to="`/videos/${props.video.video_id}`"
        class="group relative hover:bg-bg-normal transition-all duration-200 rounded-md"
    >
        <img
            :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
            alt=""
            class="-z-10 pointer-events-none aspect-video absolute top-0 right-0 left-0 w-full blur-3xl opacity-0 group-hover:opacity-30 transition-all duration-200 group-hover:scale-150"
        />
        <div class="relative transition-all duration-200 group-hover:scale-104">
            <img
                :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                alt=""
                class="relative mb-2 aspect-video w-full rounded-md"
            />
            <div class="absolute right-2 bottom-2 bg-bg-normal leading-none p-1.5 text-text-muted text-sm rounded-md">
                {{ formattedDuration }}
            </div>
        </div>

        <div class="transition-all duration-200 px-4 pt-1 pb-3 z-10 relative group-hover:translate-y-0.5">
            <h2 class="truncate font-bold uppercase text-lg">
                {{ props.video.title }}
            </h2>
            <p class="text-text-muted">Super Mario Kart World</p>
            <p class="text-text-muted">{{ daysAgo }} days ago</p>

            <div
                v-if="props.video.categories.length"
                class="absolute top-full max-h-[200px] overflow-auto duration-200 pointer-events-none group-hover:pointer-events-auto -mt-2 left-0 right-0 bg-bg-normal flex flex-col gap-2 p-4 pt-1 rounded-b-md opacity-0 group-hover:opacity-100 transition-all"
            >
                <!-- <template v-for="item in 3"> -->
                <div v-for="category in props.video.categories" :key="category.id" class="flex items-center gap-2 pt-1">
                    <img :src="category.image_url" alt="" class="rounded-md w-6" />

                    <span class="text-sm text-text-muted">
                        {{ category.title }}
                    </span>
                </div>
                <!-- </template> -->
            </div>
        </div>
    </RouterLink>
</template>
