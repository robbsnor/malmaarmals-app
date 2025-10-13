<script setup lang="ts">
import type { Tables } from '../../shared/types/database.types';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useAttrs } from 'vue';

const attrs = useAttrs();

const props = withDefaults(
    defineProps<{
        playlist: Tables<'playlists'>;
    }>(),
    {}
);
</script>

<template>
    <RouterLink
        :to="`/playlists/${props.playlist.id}`"
        class="relative transition-all duration-200 rounded-md flex gap-4"
    >
        <div class="relative transition-all duration-200 group w-32 shrink-0">
            <div
                v-for="n in 3"
                :key="n"
                class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none"
                :src="n"
                aria-hidden="true"
                :class="[
                    n === 1 && '-top-4 scale-90 group-hover:-translate-y-2 bg-black-300',
                    n === 2 && '-top-2 scale-95 group-hover:-translate-y-1 bg-black-600',
                ]"
            ></div>

            <VideoThumbnail :to="`/about`" :src="BucketHelper.getThumbnailUrl(2170491752)" icon="mdi-playlist-play" />
        </div>

        <div>
            <h2 class="font-bold text-md pt-2">{{ playlist.title }}</h2>
            <!-- <p class="text-muted text-sm font-medium">{{ playlist.episodes }} Video's</p> -->
        </div>
    </RouterLink>
</template>
