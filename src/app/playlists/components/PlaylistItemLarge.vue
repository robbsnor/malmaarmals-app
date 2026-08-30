<script setup lang="ts">
import type { Playlist } from '../models/playlist.model';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { computed } from 'vue';
import { useDisplay } from 'vuetify';

const props = withDefaults(
    defineProps<{
        playlist: Playlist;
    }>(),
    {}
);

const { lgAndUp } = useDisplay();

const categories = computed(() => {
    const cats = props.playlist.videos.flatMap((video) => video.chapters.map((chapter) => chapter.category.title));
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});
</script>

<template>
    <div v-if="lgAndUp" class="relative transition-all duration-200 mt-6">
        <RouterLink
            :to="{ name: 'playlist', params: { id: props.playlist.id } }"
            class="relative transition-all duration-200 group"
        >
            <div
                v-for="n in 2"
                :key="n"
                class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none overflow-hidden aspect-video"
                aria-hidden="true"
                :class="[
                    n === 1 &&
                        `-top-2 scale-95 group-hover:scale-98 group-hover:-translate-y-3 bg-black-1500 brightness-40 z-0 delay-25`,
                    n === 2 && '-top-4 scale-90 group-hover:-translate-y-5 bg-black-1500 brightness-20 -z-1 delay-50',
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
                :src="BucketHelper.getThumbnailUrl(Number(props.playlist.videos?.[0]?.video_id))"
                icon="mdi-playlist-play"
            />
        </RouterLink>

        <div>
            <h2 class="font-bold text-lg pt-2 line-clamp-2 leading-tight">
                {{ props.playlist.title }}
            </h2>
            <div v-if="categories.length" class="text-muted text-md font-medium line-clamp-2">
                {{ categories.join(', ') }}
            </div>
            <div class="text-muted-more text-md font-medium">{{ props.playlist.videos.length }} Videos</div>
        </div>
    </div>
</template>
