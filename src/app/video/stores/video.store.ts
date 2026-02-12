import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/models/database.types';
import type { VideoProgression } from '../models/video-progression.model';
import { useIdle, useMediaControls, useWindowSize } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { type ChaptersWithCategory } from '../models/chapters-with-category.model';
import _ from 'lodash';
import { messagesQueryStringSelect, type Messages } from '../models/messages.model';
import { v4 } from 'uuid';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const playlistsStore = usePlaylistsStore();

    // layout
    const theaterMode = ref(true);
    const showChat = ref(true);
    const showExtraInfoMobile = ref(false);
    const { width: windowWidth } = useWindowSize();

    // video
    const info = ref<Tables<'videos'>>();
    const id = ref<number>();
    const infoLoading = ref(true);

    // player
    const showControllsAndInfo = ref(true);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const src = ref<string>(null);
    const srcNotFound = ref(false);
    const {
        currentTime,
        duration,
        waiting,
        seeking,
        ended,
        stalled,
        buffered,
        playing,
        rate,
        volume,
        muted,
        onSourceError,
        onPlaybackError,
    } = useMediaControls(videoRef);
    const currentTimeRounded = computed(() => Math.floor(currentTime.value));
    const prettyCurrentTime = computed(() => TimeHelper.formatTime(currentTime.value));
    const prettyDuration = computed(() => TimeHelper.formatTime(duration.value));
    const playerIsActive = ref(false);
    const playerIsMini = ref(true);
    const { idle } = useIdle(7 * 1000);

    // messages
    const messages = ref<Messages>([]);
    const messagesLoading = ref(true);
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );

    // chapters
    const chaptersOG = ref<ChaptersWithCategory>([]);
    const chapters = ref<ChaptersWithCategory>([]);
    const chaptersLoading = ref(true);
    const hasChapterChanges = computed(() => !_.isEqual(chapters.value, chaptersOG.value));
    const chaptersEditMode = ref(false);
    const showChapterDrawer = ref(false);

    // playlist
    const playlistId = ref<string>();
    const playlist = computed(() => {
        if (playlistId.value) {
            return playlistsStore.playlistsWithVideos.find((p) => p.id === playlistId.value);
        } else {
            // find playlist that contains the video
            return playlistsStore.playlistsWithVideos.find((p) => p.videos.some((v) => v.video_id === id.value));
        }
    });

    const playlistNextVideo = computed(() => {
        if (!playlist.value) return null;
        const currentIndex = playlist.value.videos.findIndex((v) => v.video_id === id.value);
        if (currentIndex === -1 || currentIndex === playlist.value.videos.length - 1) return null;
        return playlist.value.videos[currentIndex + 1];
    });

    const playlistPrevVideo = computed(() => {
        if (!playlist.value) return null;
        const currentIndex = playlist.value.videos.findIndex((v) => v.video_id === id.value);
        if (currentIndex <= 0) return null;
        return playlist.value.videos[currentIndex - 1];
    });

    // functions
    onMounted(() => {
        if (windowWidth.value > 1024) theaterMode.value = false;
    });

    async function init(videoId: number, _playlistId?: string) {
        reset();

        id.value = videoId;
        playlistId.value = _playlistId;
        await fetchInfo();
        await setSrc();
    }

    function reset() {
        chaptersOG.value = [];
        chapters.value = [];
        info.value = null;
        currentTime.value = 0;
        duration.value = 0;
        messages.value = [];
        id.value = null;
        chaptersLoading.value = true;
        chapters.value = [];
        info.value = null;
        playing.value = false;
        chaptersEditMode.value = false;
        messagesLoading.value = true;
        infoLoading.value = true;
        srcNotFound.value = false;
    }

    async function fetchInfo() {
        const { data, error } = await supabase.from('videos').select('*').eq('video_id', Number(id.value)).single();

        infoLoading.value = false;
        if (error) throw error;

        info.value = data;
    }

    async function fetchChapters() {
        chaptersLoading.value = true;
        const { data, error } = await supabase
            .from('chapters')
            .select('*, category:categories(*)')
            .order('start_s', { ascending: true })
            .eq('video_id', id.value);

        chaptersLoading.value = false;
        if (error) throw error;

        chaptersOG.value = _.cloneDeep(data);
        chapters.value = _.cloneDeep(data);
    }

    async function fetchMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select(messagesQueryStringSelect)
            .eq('video_id', Number(id.value))
            .order('offset_sec', { ascending: true });

        messagesLoading.value = false;

        if (error) throw error;
        messages.value = data;
    }

    function setVideoRef(el: HTMLVideoElement) {
        videoRef.value = el;
    }

    async function setSrc() {
        const { data, error } = await BucketHelper.getVideoUrl(id.value);
        if (error) throw error;

        src.value = data.signedUrl;
    }

    function setTimePrior(sec: number) {
        currentTime.value = sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
    }

    function getTimePrior(sec: number) {
        return sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
    }

    async function addEmptyChapter() {
        const emptyChapter = {
            id: v4(),
            category_id: '',
            end_s: 0,
            start_s: currentTimeRounded.value,
            video_id: id.value,
            category: {
                id: v4(),
                category_id: '',
                image_url: '',
                title: '',
            },
        };
        chapters.value.push(emptyChapter);
    }

    const saveVideoProgression = () => {
        if (!currentTimeRounded.value) return;

        const obj: VideoProgression = {
            current_time_s: currentTimeRounded.value,
            total_time_s: info.value.length_sec,
            percentage: Math.round((100 / info.value.length_sec) * currentTimeRounded.value),
        };
        localStorage.setItem(id.value.toString(), JSON.stringify(obj));
    };

    const loadVideoProgression = () => {
        const timeObj: VideoProgression = JSON.parse(localStorage.getItem(id.value.toString()));
        if (!timeObj) return;
        currentTime.value = Number(timeObj.current_time_s);
    };

    function resetChaptersForm() {
        chapters.value = _.cloneDeep(chaptersOG.value);
    }

    onPlaybackError(async (e) => {
        playing.value = false;
    });

    watch(currentTimeRounded, () => {
        saveVideoProgression();
    });

    // check if video exists
    watch(videoRef, () => {
        if (!videoRef.value) return;

        videoRef.value.onerror = (e) => {
            srcNotFound.value = true;
        };
    });

    // hide controls and info when idle
    watch(idle, (isIdle) => {
        if (!playing.value) return;
        if (!isIdle) return;
        showControllsAndInfo.value = false;
    });

    // auto play when done loading
    watchEffect(() => {
        if (!waiting.value) playing.value = true;
    });

    // sort chapters by start_s
    watch(
        () => chapters.value,
        (newChapters) => {
            if (!newChapters) return;
            newChapters.sort((a, b) => a.start_s - b.start_s);
        },
        { deep: true }
    );

    watch(waiting, (isWaiting) => {
        if (isWaiting) {
            showControllsAndInfo.value = true;
        }
    });

    // close mini player when video not found
    watchEffect(() => {
        if (playerIsMini.value && srcNotFound.value) {
            playerIsActive.value = false;
        }
    });

    watch(volume, () => {
        muted.value = false;
    });

    return {
        // layout
        theaterMode,
        showChat,
        showExtraInfoMobile,

        // video
        info,
        id,
        infoLoading,
        src,
        srcNotFound,

        // player
        showControllsAndInfo,
        videoRef,
        currentTime,
        duration,
        waiting,
        seeking,
        ended,
        stalled,
        playing,
        rate,
        volume,
        muted,
        currentTimeRounded,
        prettyCurrentTime,
        prettyDuration,
        playerIsActive,
        playerIsMini,

        // chapters
        chapters,
        chaptersLoading,
        chaptersEditMode,
        showChapterDrawer,
        hasChapterChanges,

        // playlist
        playlistId,
        playlist,
        playlistNextVideo,
        playlistPrevVideo,

        // messages
        messages,
        messagesLoading,
        subCount,

        // functions
        init,
        setSrc,
        fetchInfo,
        fetchChapters,
        fetchMessages,
        resetChaptersForm,
        setVideoRef,
        setTimePrior,
        getTimePrior,
        loadVideoProgression,
        reset,
        addEmptyChapter,
        onSourceError,
        onPlaybackError,
    };
});
