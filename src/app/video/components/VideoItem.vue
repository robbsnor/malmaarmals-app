<script setup lang="ts">
import { computed, ref } from 'vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import type { VideoWithChapters } from '../models/videos-with-chapters.model';
import { formatTimeAgo } from '@vueuse/core';
import AddToPlaylistDialog from '../../playlists/components/AddToPlaylistDialog.vue';
import type { Playlist } from '../../playlists/models/playlist.model';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

const props = withDefaults(
    defineProps<{
        video: VideoWithChapters;
        playlist?: Playlist;
        showOptions?: boolean;
    }>(),
    {
        showOptions: true,
    }
);

const playlistsStore = usePlaylistsStore();
const addDialog = ref(false);
const removeDialog = ref(false);

const categories = computed(() => {
    const cats = props.video?.chapters.map((chapter) => chapter.category.title);
    const uniqueCats = Array.from(new Set(cats));
    return uniqueCats;
});

async function removeFromPlaylist() {
    try {
        console.log('owwow');
        const { error } = await supabase
            .from('playlist_videos')
            .delete()
            .eq('playlist_id', props.playlist.id)
            .eq('video_id', props.video.id);
        if (error) throw error;

        await playlistsStore.fetchPlaylists();
        await sleep(5500);
    } finally {
        removeDialog.value = false;
    }
}
</script>

<template>
    <RouterLink :to="{ name: 'video', params: { id: props.video.video_id } }" class="flex gap-4">
        <VideoThumbnail
            class="w-36 shrink-0"
            :src="BucketHelper.getThumbnailUrl(props.video.video_id)"
            :videoId="props.video.video_id"
            :durationS="props.video.length_sec"
        />

        <div class="flex-1 pt-2">
            <h2 class="font-bold text-md line-clamp-2 leading-snug">
                {{ props.video.title }}
            </h2>
            <div v-if="props.video?.chapters.length" class="text-muted text-sm font-medium line-clamp-1">
                {{ categories.join(', ') }}
            </div>
            <div class="text-muted-more text-sm font-medium">
                {{ formatTimeAgo(new Date(props.video.recorded_at)) }}
            </div>
        </div>

        <v-menu v-if="props.showOptions">
            <template #activator="{ props }">
                <v-btn
                    v-auth
                    @click.prevent.stop
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    class="shrink-0 text-muted!"
                    v-bind="props"
                />
            </template>

            <v-list>
                <v-list-item @click="addDialog = true" v-if="!props.playlist" v-bind="props" prepend-icon="mdi-plus">
                    Add to playlist
                </v-list-item>

                <v-list-item
                    @click="removeDialog = true"
                    v-if="props.playlist"
                    prepend-icon="mdi-trash-can-outline"
                    class="text-red-400!"
                >
                    Remove from playlist
                </v-list-item>
            </v-list>
        </v-menu>

        <AddToPlaylistDialog :video="video" v-model="addDialog" />
        <DeleteDialog
            v-model="removeDialog"
            @confirm="removeFromPlaylist"
            title="Remove video?"
            :description="`Are you sure you want to remove &quot;${props.video.title}&quot; from this playlist?`"
            :show-body="false"
            confirmText="remove"
        >
        </DeleteDialog>
    </RouterLink>
</template>
