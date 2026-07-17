<script setup lang="ts">
import { useElementSize, useFullscreen, useScroll } from '@vueuse/core';
import { useRouter } from 'vue-router';
import { useVideoStore } from '../stores/video.store';
import { computed, ref, useTemplateRef } from 'vue';
import ChaptersDrawer from './ChaptersDrawer.vue';
import AddToPlaylistDialog from '../../playlists/components/AddToPlaylistDialog.vue';
import PlayerButton from './PlayerButton.vue';
import VolumeControl from './VolumeControl.vue';
import { useScreenOrientation } from '@vueuse/core';
import ChapterMarker from './ChapterMarker.vue';
import PreferenceDrawer from './PreferenceDrawer.vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import { routeHistory } from '../../../router/router';
import { useVideosStore } from '../stores/videos.store';
import VideoInfo from './VideoInfo.vue';
import _ from 'lodash';
import { useManageChaptersStore } from '../stores/manage-chapters.store';
import Cast from './Cast.vue';
import ShareButton from './ShareButton.vue';
import { useAppStore } from '../../shared/stores/app.store.ts';
import HypeGraph from './HypeGraph.vue';

const appStore = useAppStore();
const videoStore = useVideoStore();
const videosStore = useVideosStore();
const manageChaptersStore = useManageChaptersStore();
const preferenceStore = usePreferenceStore();
const router = useRouter();
const durationEl = useTemplateRef<HTMLDivElement>('durationEl');
const { width, height } = useElementSize(durationEl);
const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation();
const addToPlaylistDialog = ref(false);

const goBack = () => {
    const prevUrl = _.findLast(routeHistory, (r) => r.name !== router.currentRoute.value.name); // also handles undefined
    router.push(prevUrl);
    videoStore.playerIsMini = true;
};

function changeOrientation() {
    if (!isSupported) return;

    if (orientation.value === 'landscape-primary' || orientation.value === 'landscape-secondary') {
        console.log('isLandscape');
        unlockOrientation();
        lockOrientation('portrait-primary');
    } else {
        console.log('isPortrait');
        unlockOrientation();
        lockOrientation('landscape-primary');
    }
}

async function goToNextVideo() {
    const nextId = videosStore.videos.findIndex((v) => v.video_id === videoStore.video.video_id) + 1;

    if (nextId) {
        await router.push({ name: 'stream', params: { id: videosStore.videos[nextId].video_id } });
        window.location.reload();
    }
}

async function goToPreviousVideo() {
    const prevId = videosStore.videos.findIndex((v) => v.video_id === videoStore.video.video_id) - 1;

    if (prevId) {
        await router.push({ name: 'stream', params: { id: videosStore.videos[prevId].video_id } });
        window.location.reload();
    }
}

function toggleTheaterMode() {
    videoStore.theaterMode = !videoStore.theaterMode;
    const { y } = useScroll(videoStore.videoColRef, { behavior: 'smooth' });
    y.value = 0;
}
</script>

<template>
    <div
        v-if="!videoStore.playerIsMini"
        v-visible="videoStore.showControllsAndInfo && !videoStore.playerIsMini"
        class="z-video-controls absolute inset-0 flex flex-col"
    >
        <div class="relative flex flex-col grow">
            <div class="absolute inset-0 bg-black/50" @click="videoStore.showControllsAndInfo = false"></div>

            <div class="flex items-center justify-between gap-4 pt-2 px-4">
                <PlayerButton @click="goBack()" icon="mdi-chevron-down" />

                <div class="flex items-center gap-1">
                    <Auth>
                        <PlayerButton icon="mdi-skip-previous" @click="goToPreviousVideo()" />
                        <PlayerButton icon="mdi-skip-next" @click="goToNextVideo()" />
                    </Auth>

                    <ShareButton />

                    <PlayerButton v-auth @click="addToPlaylistDialog = true" :size="24" icon="mdi-plus" />
                    <AddToPlaylistDialog v-model="addToPlaylistDialog" :video="videoStore.video" />

                    <Cast />
                    <PreferenceDrawer />
                    <!-- <PlayerButton
                        @click="videoStore.showChat = !videoStore.showChat"
                        :icon="videoStore.showChat ? 'mdi-arrow-expand-right' : 'mdi-arrow-expand-left'"
                        :size="20"
                        class="hidden md:block"
                    /> -->
                </div>
            </div>

            <div
                class="relative flex grow justify-center items-center flex-col"
                @click="videoStore.showControllsAndInfo = false"
            >
                <div class="flex justify-center items-center">
                    <button @click="videoStore.currentTime -= 10" class="relative p-4 rounded-full">
                        <v-icon size="24" icon="mdi-rewind-10" />
                    </button>

                    <div v-if="videoStore.waiting" class="relative size-16 flex justify-center items-center">
                        <v-progress-circular class="relative" indeterminate size="48" width="4" />
                    </div>

                    <button v-else @click="videoStore.playing = !videoStore.playing">
                        <v-icon
                            :icon="
                                videoStore.playing || (!videoStore.playing && videoStore.waiting)
                                    ? 'mdi-pause'
                                    : 'mdi-play'
                            "
                            size="64"
                        />
                    </button>

                    <button @click="videoStore.currentTime += 30" class="relative p-4 rounded-full">
                        <v-icon size="24" icon="mdi-fast-forward-30" />
                    </button>
                </div>

                <div
                    class="absolute font-bold text-muted translate-y-full mt-2 text-center pointer-events-none select-none"
                >
                    Loading can take up to a minute, <br />
                    please be patient.
                </div>
            </div>

            <div class="flex flex-col px-4">
                <div class="flex items-end justify-between gap-4">
                    <div class="relative flex items-center gap-2 leading-tight -mb-2">
                        <div :style="{ width: `${width}pfx` }">{{ videoStore.prettyCurrentTime }}</div>
                        /
                        <div ref="durationEl" class="text-right">{{ videoStore.prettyDuration }}</div>

                        <VolumeControl />
                    </div>

                    <div class="relative flex items-center gap-2 -mb-2 z-1">
                        <PlayerButton
                            v-if="videoStore.supportsPictureInPicture"
                            title="Picture-in-picture toggle"
                            :size="22"
                            :icon="
                                videoStore.isPictureInPicture
                                    ? 'mdi-picture-in-picture-bottom-right-outline'
                                    : 'mdi-picture-in-picture-bottom-right'
                            "
                            :color="videoStore.isPictureInPicture ? 'primary' : ''"
                            @click="videoStore.togglePictureInPicture()"
                        />

                        <PlayerButton
                            title="chat toggle"
                            @click="videoStore.showChat = !videoStore.showChat"
                            :icon="videoStore.showChat ? 'mdi-chat' : 'mdi-chat-outline'"
                            :size="20"
                            :class="{ hidden: !appStore.isLandscape }"
                        />

                        <ChaptersDrawer />

                        <PlayerButton
                            v-if="appStore.isLandscape"
                            @click="toggleTheaterMode()"
                            title="theatre-mode toggle"
                            :icon="videoStore.theaterMode ? 'mdi-dock-bottom' : 'mdi-dock-right'"
                        />

                        <!-- :icon="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'" -->
                        <PlayerButton
                            title="fullscreen toggle"
                            :icon="videoStore.isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
                            @click="videoStore.toggleFullscreen()"
                        />
                    </div>
                </div>

                <div class="relative">
                    <HypeGraph />

                    <v-slider
                        v-model="videoStore.currentTime"
                        hide-details="auto"
                        thumb-size="12"
                        track-size="4"
                        color="primary"
                        :max="videoStore.duration"
                        :min="0"
                        :step="1"
                    />

                    <ChapterMarker
                        v-for="chapter in manageChaptersStore.chapters"
                        :key="chapter.start_s"
                        :chapter="chapter"
                    />
                </div>
            </div>
        </div>

        <VideoInfo v-if="videoStore.theaterMode && appStore.isLandscape"> </VideoInfo>
    </div>
</template>

<style scoped>
.v-slider.v-input--horizontal {
    margin: 0;
}

/* .v-input {
    pointer-events: none !important;
}

:deep(.v-slider-thumb) {
    pointer-events: all !important;
}

:deep(.v-slider-thumb__surface) {
    color: white !important;
} */
</style>
