import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import { useIdle, useMediaControls, useWindowSize } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import _ from 'lodash';
import { messagesQueryStringSelect, type Messages } from '../models/messages.model';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { useVideosStore } from './videos.store';
import { useHistoryStore } from '../../history/stores/history.store';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const playlistsStore = usePlaylistsStore();
    const videosStore = useVideosStore();
    const historyStore = useHistoryStore();

    // layout
    const theaterMode = ref(true);
    const showChat = ref(true);
    const casting = ref(false);
    const showExtraInfoMobile = ref(false);
    const { width: windowWidth } = useWindowSize();
    const videoContainerRef = ref<HTMLElement | null>(null);
    const videoColRef = ref<HTMLElement | null>(null);

    // video
    const info = computed(() => videosStore.videos.find((v) => v.video_id === id.value));
    const chapters = computed(() => info.value?.chapters);
    const id = ref<number>();

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
    const { idle } = useIdle(4 * 1000);

    // messages
    const messages = ref<Messages>([]);
    const messagesLoading = ref(true);
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );

    const giftSubs = computed(() => {
        return messages.value
            .filter((m) => m.text.includes('gifted a'))
            .reduce<{ username: string; amount: number }[]>((acc, m) => {
                const existing = acc.find((item) => item.username === m.user_name);
                if (existing) {
                    existing.amount += 1;
                } else {
                    acc.push({ username: m.user_name, amount: 1 });
                }
                return acc;
            }, [])
            .sort((a, b) => b.amount - a.amount);
    });

    // playlist
    const playlistId = ref<string>();
    const playlist = computed(() => {
        if (playlistId.value) {
            return playlistsStore.playlists.find((p) => p.id === playlistId.value);
        } else {
            // find playlist that contains the video
            return playlistsStore.playlists.find((p) => p.videos.some((v) => v.video_id === id.value));
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
        await setSrc();
    }

    function reset() {
        currentTime.value = 0;
        duration.value = 0;
        messages.value = [];
        id.value = null;
        playing.value = false;
        messagesLoading.value = true;
        srcNotFound.value = false;
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
        // src.value =
        //     'https://backend.malmaarmals.nl/videos/2076579081?exp=1771763084231&sig=LdvBaZKyJqUzW2DzN8GhGr4Rz_1Rsu3S-bVcDPcdAO8';
    }

    function setTimePrior(sec: number) {
        currentTime.value = sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
    }

    function getTimePrior(sec: number) {
        return sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
    }

    const loadVideoProgression = () => {
        console.log(info.value.id);
        const historyItem = historyStore.history.find((h) => h.video_id === info.value.id);
        console.log(historyItem.video_time);
        if (!historyItem) return;

        currentTime.value = Number(historyItem.video_time);
    };

    onPlaybackError(async (e) => {
        playing.value = false;
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

    watch(currentTimeRounded, (time) => {
        if (time % 5 !== 0) return;
        historyStore.recordWatch(info.value.id, time);
    });

    return {
        // layout
        theaterMode,
        showChat,
        casting,
        showExtraInfoMobile,
        videoContainerRef,
        videoColRef,

        // video
        info,
        id,
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

        // playlist
        playlistId,
        playlist,
        playlistNextVideo,
        playlistPrevVideo,

        // messages
        messages,
        messagesLoading,
        subCount,
        giftSubs,

        // functions
        init,
        setSrc,
        fetchMessages,
        setVideoRef,
        setTimePrior,
        getTimePrior,
        loadVideoProgression,
        reset,
        onSourceError,
        onPlaybackError,
    };
});
