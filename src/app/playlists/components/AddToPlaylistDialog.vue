<script setup lang="ts">
import { supabase } from '../../../supabase';
import { computed, ref } from 'vue';
import { usePlaylistsStore } from '../stores/playlists.store';
import type { VideoWithChapters } from '../../video/models/videos-with-chapters.model';
import { sleep } from '../../shared/helpers/sleep';
import VideoItem from '../../video/components/VideoItem.vue';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import type { Playlist } from '../models/playlist.model';
import AddOrEditPlaylistForm from './AddOrEditPlaylistForm.vue';

const props = defineProps<{ video: VideoWithChapters }>();

const playlistsStore = usePlaylistsStore();

const formRef = ref<InstanceType<typeof AddOrEditPlaylistForm>>();

const dialog = defineModel<boolean>();
const tab = ref<'add' | 'create'>('add');
const form = ref<{
    playlist: Playlist;
}>();
const title = computed(() => (tab.value === 'add' ? 'Add to playlist' : 'Create playlist'));
const valid = ref(false);
const loading = ref(false);
const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const playlists = computed(() =>
    playlistsStore.playlists.filter((p) => !p.videos.some((v) => v.id === props.video.id))
);

function onOpen() {
    resetForm();
    tab.value = 'add';
}

function resetForm() {
    form.value = {
        playlist: null,
    };
}

async function submit() {
    try {
        loading.value = true;

        const { error } = await supabase.from('playlist_videos').insert({
            playlist_id: form.value.playlist.id,
            video_id: props.video.id,
        });
        if (error) throw error;

        await sleep(500);
        await playlistsStore.fetchPlaylists();
        dialog.value = false;
    } catch (error) {
        throw error;
    } finally {
        loading.value = false;
    }
}

function onPlaylistCreateSuccess(playlistId: string) {
    tab.value = 'add';
    formRef.value?.resetForm();
    form.value.playlist = playlistsStore.playlists.find((p) => p.id === playlistId);
}
</script>

<template>
    <Dialog v-model="dialog" inset :title="title" @open="onOpen()" :bodyPadding="false">
        <template #activator="activator">
            <slot v-bind="activator" name="activator"></slot>
        </template>

        <template v-if="tab === 'create'" #pre-header>
            <v-btn
                @click="tab = 'add'"
                color="primary"
                variant="tonal"
                icon="mdi-chevron-left"
                size="small"
                class="rounded!"
            >
            </v-btn>
        </template>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="add">
                <div class="flex flex-col gap-4 p-4">
                    <div class="pointer-events-none">
                        <VideoItem :video="props.video" :responsive="false" />
                    </div>

                    <v-form v-model="valid" class="flex flex-col gap-4">
                        <div class="flex gap-4">
                            <v-autocomplete
                                v-if="playlists"
                                :rules="rules"
                                v-model="form.playlist"
                                label="Playlist"
                                item-title="title"
                                autocomplete="off"
                                return-object
                                :items="playlists"
                            >
                                <template #item="{ props, item }">
                                    <v-list-item v-bind="props">
                                        <template v-slot:prepend>
                                            <div class="bg-black-200 rounded overflow-hidden w-18 aspect-video mr-4">
                                                <v-img
                                                    :src="BucketHelper.getThumbnailUrl(item.raw.videos[0]?.video_id)"
                                                    alt=""
                                                />
                                            </div>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-autocomplete>

                            <v-btn
                                color="primary"
                                variant="tonal"
                                @click="tab = 'create'"
                                icon="mdi-plus"
                                class="rounded!"
                                size="48"
                            ></v-btn>
                        </div>
                    </v-form>
                </div>
            </v-tabs-window-item>

            <v-tabs-window-item value="create">
                <div class="p-4">
                    <AddOrEditPlaylistForm ref="formRef" @success="onPlaylistCreateSuccess" />
                </div>
            </v-tabs-window-item>
        </v-tabs-window>

        <template #footer>
            <template v-if="tab === 'add'">
                <v-btn variant="text" @click="dialog = false" class="text-muted!"> cancel </v-btn>
                <v-btn color="primary" :disabled="!valid" :loading="loading" @click="submit()" variant="tonal">
                    Add to playlist
                </v-btn>
            </template>

            <template v-if="tab === 'create'">
                <v-btn class="text-muted!" variant="text" @click="tab = 'add'"> cancel </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!formRef?.valid"
                    variant="tonal"
                    :loading="formRef?.loading"
                    @click="formRef?.submit()"
                >
                    Create playlist
                </v-btn>
            </template>
        </template>
    </Dialog>
</template>
