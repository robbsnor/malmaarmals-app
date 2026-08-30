<script setup lang="ts">
import type { Playlist } from '../models/playlist.model';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useDisplay } from 'vuetify';
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        playlist: Playlist;
        responsive?: boolean;
    }>(),
    {
        responsive: true,
    }
);

const { lgAndUp } = useDisplay();
const categories = computed(() => {
    const cats = props.playlist.videos.flatMap((video) => video.chapters.map((chapter) => chapter.category.title));
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <RouterLink
        v-if="!props.responsive || !lgAndUp"
        :to="{ name: 'playlist', params: { id: props.playlist.id } }"
        class="relative transition-all duration-200 rounded-md flex gap-4 pt-4"
    >
        <div class="relative transition-all duration-200 group w-36 shrink-0">
            <div
                v-for="n in 2"
                :key="n"
                class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none overflow-hidden aspect-video"
                :src="n"
                aria-hidden="true"
                :class="[
                    n === 1 && '-top-4 scale-90 group-hover:-translate-y-2 bg-black-1500 brightness-20 -z-1 ',
                    n === 2 && '-top-2 scale-95 group-hover:-translate-y-1 bg-black-1500 brightness-40 z-0 ',
                ]"
            >
                <img
                    v-if="n < props.playlist.videos.length"
                    :src="BucketHelper.getThumbnailUrl(Number(props.playlist.videos?.[0]?.video_id))"
                    alt=""
                    class="cover w-full h-full"
                />
            </div>

            <Thumbnail
                :src="BucketHelper.getThumbnailUrl(Number(playlist.videos?.[0]?.video_id))"
                icon="mdi-playlist-play"
            />
        </div>

        <div class="pt-2">
            <h2 class="font-bold text-md">{{ playlist.title }}</h2>
            <div class="text-muted text-sm font-medium">{{ playlist.videos.length }} Videos</div>

            <div v-if="categories.length" class="text-muted text-md font-medium line-clamp-1">
                {{ categories.join(', ') }}
            </div>
        </div>
    </RouterLink>
</template>
