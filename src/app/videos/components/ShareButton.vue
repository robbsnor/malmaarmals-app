<script setup lang="ts">
import { useClipboard, useShare } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';
import VideoItem from './VideoItem.vue';

const { share, isSupported } = useShare();

const route = useRoute();
const videoStore = useVideoStore();

const dialog = defineModel();
const withTime = ref(false);
const url = computed(
    () => `${window.location.origin}${route.path}${withTime.value ? `?t=${videoStore.currentTimeRounded}` : ''}`
);
const { text, copy, copied } = useClipboard({ source: url });

function startShare() {
    share({
        title: `Watch ${videoStore.video.title}`,
        url: url.value,
    });
}

function onOpen() {
    videoStore.playing = false;
}
</script>

<template>
    <PlayerButton @click="dialog = true" icon="mdi-share-variant" :size="20" />

    <Dialog v-model="dialog" title="Share" icon="mdi-share-variant" @open="onOpen()">
        <div class="flex flex-col gap-4">
            <VideoItem
                class="pointer-events-none! self-stretch"
                :video="videoStore.video"
                :show-options="false"
            ></VideoItem>

            <div class="flex flex-col">
                <div
                    class="flex justify-between items-center gap-4 p-2 pl-4 text-muted rounded-md bg-black-500 border border-black-800 self-stretch"
                >
                    <div>{{ url }}</div>
                    <v-btn
                        v-if="isSupported"
                        @click="startShare()"
                        size="small"
                        color="primary"
                        variant="tonal"
                        icon="mdi-share-variant"
                    ></v-btn>

                    <v-btn
                        v-else
                        @click="copy()"
                        size="small"
                        color="primary"
                        variant="tonal"
                        :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                    ></v-btn>
                </div>

                <div class="ml-auto">
                    <Switch v-model="withTime" text="Use curent time" :header-padding="false"></Switch>
                </div>
            </div></div
    ></Dialog>
</template>
