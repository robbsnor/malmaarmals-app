<script setup lang="ts">
import type { Playlist } from '../models/playlist.model';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { useDisplay } from 'vuetify';

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
</script>

<template>
    <RouterLink
        v-if="!props.responsive || !lgAndUp"
        :to="{ name: 'playlist', params: { id: props.playlist.id } }"
        class="relative transition-all duration-200 rounded-md flex gap-4 pt-4"
    >
        <div class="relative transition-all duration-200 group w-36 shrink-0">
            <div
                v-for="n in 3"
                :key="n"
                class="absolute inset-0 rounded-md origin-top transition-all pointer-events-none"
                :src="n"
                aria-hidden="true"
                :class="[
                    n === 1 && '-top-4 scale-90 group-hover:-translate-y-2 bg-black-300',
                    n === 2 && '-top-2 scale-95 group-hover:-translate-y-1 bg-black-400',
                ]"
            ></div>

            <Thumbnail
                :src="BucketHelper.getThumbnailUrl(Number(playlist.videos?.[0]?.video_id))"
                icon="mdi-playlist-play"
            />
        </div>

        <div class="pt-2">
            <h2 class="font-bold text-md">{{ playlist.title }}</h2>
            <div class="text-muted text-sm font-medium">{{ playlist.videos.length }} Video's</div>
        </div>
    </RouterLink>
</template>
