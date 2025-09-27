<script setup lang="ts">
import { ref, onMounted, computed, useTemplateRef, watch, onUnmounted } from 'vue';
import { supabase } from '../../supabase';
import { useRoute } from 'vue-router';
import Chat from './components/Chat.vue';
import Player from '../shared/components/Player.vue';
import { playerDefaultOptions } from '../shared/data/player.data';
import { useDisplay } from 'vuetify';
import { TitleHelper } from '../shared/helpers/title.helper';
import type { Tables } from '../shared/types/database.types';
import Info from './components/Info.vue';
import InfoDesktop from './components/InfoDesktop.vue';
import { useAppStore } from '../shared/stores/app.store';
import { CHAPTERS_MOCK } from './data/chapters.mock';

TitleHelper.setTitle('video');

const route = useRoute();
const appStore = useAppStore();
const { mdAndUp, lgAndUp } = useDisplay();
const videoId = route.params.id as string;

const videoInfo = ref<Tables<'videos'>>();
const videoTime = ref(0);
const playerRef = useTemplateRef<InstanceType<typeof Player>>('playerRef');
const showInfo = ref(false);

const chapters = ref(CHAPTERS_MOCK);

const options = computed(() => ({
    controls: playerDefaultOptions.controls.filter((item: any) => !['pip', 'volfume', 'mute'].includes(item)),
    markers: {
        enabled: true,
        points: chapters.value.map((chapter) => ({
            time: chapter.start_s,
            label: chapter.title,
        })),
    },
}));

const seekToChapter = (seconds: number) => {
    playerRef.value.videoRef.currentTime = seconds;
    playerRef.value.videoRef.play();
};

const getVideoInfo = async () => {
    const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(videoId)).single();
    if (error) return console.error('Error fetching videos:', error);

    videoInfo.value = data;
    TitleHelper.setTitle(data.title);
};

const updateVideoTime = (e: any | any) => {
    if (!e || !e.target.currentTime) return;
    videoTime.value = Math.floor(e.target.currentTime);
};

watch(lgAndUp, (isTrue) => {
    console.log(isTrue);
    isTrue ? appStore.showHeader() : appStore.hideHeader();
});

onMounted(async () => {
    if (lgAndUp.value) {
        appStore.showHeader();
    } else {
        appStore.hideHeader();
    }

    await getVideoInfo();

    playerRef.value.player.on('controlsshown', () => {
        showInfo.value = true;
    });
    playerRef.value.player.on('controlshidden', () => {
        showInfo.value = false;
    });
});

onUnmounted(() => {
    appStore.showHeader();
});
</script>

<template>
    <div v-if="videoInfo" class="h-available overflow-hidden flex flex-col md:flex-row">
        <div class="relative md:grow md:overflow-auto lg:p-4 lg:pr-0 xl:pr-2">
            <div class="h-full lg:h-auto xl:h-[calc(var(--height-available)-48fpx-84px)]">
                <Player
                    :options="options"
                    @timeupdate="updateVideoTime"
                    ref="playerRef"
                    :stretchHeight="true"
                    class="lg:rounded-md overflow-hidden"
                >
                    <source :src="`http://localhost:8000/videos/${videoInfo.video_id}`" type="video/mp4" />
                </Player>
            </div>

            <InfoDesktop :videoInfo="videoInfo" :chapters="chapters" @clickChapter="seekToChapter($event.start_s)" />
            <Info
                :showInfo="showInfo"
                :videoInfo="videoInfo"
                :chapters="chapters"
                @clickChapter="seekToChapter($event.start_s)"
            />
        </div>

        <div class="relative overflow-hidden grow-1 shrink-0 md:grow-0 md:basis-[220px] lg:basis-[320px]">
            <Chat :videoId="Number(videoId)" :videoTime="videoTime" />
        </div>
    </div>
</template>
