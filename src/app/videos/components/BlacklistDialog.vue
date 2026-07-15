<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Video } from '../models/video.model';
import { useVideoStore } from '../stores/video.store';
import { useVideosStore } from '../stores/videos.store';
import { supabase } from '../../../supabase';
import { toast } from 'vue-sonner';
import VideoItem from './VideoItem.vue';
import { sleep } from '../../shared/helpers/sleep.ts';

const props = withDefaults(
    defineProps<{
        video: Video;
    }>(),
    {}
);

const dialog = defineModel<Boolean>();
const videosStore = useVideosStore();
const loading = ref(false);

async function blacklistVideo() {
    try {
        const id = props.video.video_id;
        loading.value = true;

        // remove from videos table
        const { error: delError } = await supabase.from('videos').delete().eq('video_id', id);
        if (delError) throw delError;

        // add id to blacklist table
        const now = new Date();
        const { error: blError } = await supabase.from('videos_blacklist').insert({ id, date: now.toISOString() });
        if (blError) throw blError;

        // refetch videos
        await videosStore.fetchVideos();
        toast.success(`Blacklisted video: ${props.video.title}`);
    } catch (error) {
        toast.error(error.message);
        throw error;
    } finally {
        dialog.value = false;
        loading.value = false;
    }
}
</script>

<template>
    <DeleteDialog
        v-model="dialog"
        @confirm="blacklistVideo()"
        title="Blacklist video"
        :description="`Are you sure you want to blacklist this video?`"
        icon="mdi-cancel"
        :show-body="true"
        confirmText="blacklist"
        :loading="loading"
    >
        <div class="p-4">
            <VideoItem class="pointer-events-none" :video="props.video" :show-options="false" />
        </div>
    </DeleteDialog>
</template>
