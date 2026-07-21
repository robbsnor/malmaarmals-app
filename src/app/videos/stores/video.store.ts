import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import {
    onKeyStroke,
    useIdle,
    useMediaControls,
    useWindowSize,
    useLocalStorage,
    useFullscreen,
    useScroll,
    useScreenOrientation,
} from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import _, { countBy } from 'lodash';
import { messagesQueryStringSelect, type Message } from '../models/messages.model';
import { fetchAll } from '../../shared/helpers/supabase-fetch-all.helper';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { useVideosStore } from './videos.store';
import { useHistoryStore } from '../../history/stores/history.store';
import Footer from '../../layout/components/Footer.vue';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const playlistsStore = usePlaylistsStore();
    const videosStore = useVideosStore();
    const historyStore = useHistoryStore();
    const { width: windowWidth, height: windowHeight } = useWindowSize();

    //
    // layout
    //
    const theaterMode = ref(false);
    const showChat = ref(true);
    const { isFullscreen, enter: enterFullscreen, exit: exitFullscreen, toggle: toggleFullscreen } = useFullscreen();
    const showWidgetsMobile = ref(false);
    const videoColRef = ref<HTMLElement | null>(null);
    const { y: videoColScrollY } = useScroll(videoColRef, { behavior: 'smooth' });
    const { isSupported, orientation, angle, lockOrientation, unlockOrientation } = useScreenOrientation();

    watch(orientation, (e) => {
        if (windowWidth.value > 1024) return;

        if (e.includes('landscape')) {
            theaterMode.value = true;
            enterFullscreen();
        } else {
            exitFullscreen();
        }
    });

    function videoColScrollToTop() {
        videoColScrollY.value = 0;
    }

    //
    // video
    //
    const id = ref<number>();
    const video = computed(() => videosStore.videos.find((v) => v.video_id === id.value));
    const chapters = computed(() => video.value?.chapters);

    async function init(videoId: number, _playlistId?: string) {
        reset();

        id.value = videoId;
        playlistId.value = _playlistId;
        await setSrc();
    }

    function reset() {
        currentTime.value = 0;
        src.value = '';
        duration.value = 0;
        messages.value = [];
        id.value = null;
        playing.value = false;
        messagesLoading.value = true;
        srcNotFound.value = false;
    }

    //
    // player
    //
    const showControllsAndInfo = ref(true);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const src = ref<string>(null);
    const srcNotFound = ref(false);
    const casting = ref(false);
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
        supportsPictureInPicture,
        isPictureInPicture,
        togglePictureInPicture,
        onSourceError,
        onPlaybackError,
    } = useMediaControls(videoRef);
    const persistedVolume = useLocalStorage<number>('video_volume', volume.value ?? 1);

    const currentTimeRounded = computed(() => Math.floor(currentTime.value));
    const prettyCurrentTime = computed(() => TimeHelper.formatTime(currentTime.value));
    const prettyDuration = computed(() => TimeHelper.formatTime(duration.value));
    const playerIsActive = ref(false);
    const playerIsMini = ref(true);
    const { idle } = useIdle(4 * 1_000);

    async function setSrc() {
        const { data, error } = await BucketHelper.getVideoUrl(id.value);
        if (error) throw error;

        src.value = data.signedUrl;
    }

    function setTimePrior(sec: number, resume = false) {
        currentTime.value = sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
        if (resume) playing.value = true;
        videoColScrollToTop();
    }

    function getTimePrior(sec: number) {
        return sec - TIME_PRIOR_OFFSET_S >= 0 ? sec - TIME_PRIOR_OFFSET_S : 0;
    }

    function loadVideoProgression() {
        const historyItem = historyStore.history.find((h) => h.video_id === video.value.id);
        if (!historyItem) return;

        currentTime.value = Number(historyItem.video_time);
    }

    function setVideoRef(el: HTMLVideoElement) {
        videoRef.value = el;
    }

    function isEditableTarget(target: EventTarget | null) {
        if (!(target instanceof HTMLElement)) return false;

        return Boolean(
            target.isContentEditable ||
            target.closest('input, textarea, select, [contenteditable="true"], [role="textbox"]')
        );
    }

    onKeyStroke([' ', 'ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'j', 'k', 'l'], (e) => {
        if (e.ctrlKey || e.metaKey || e.altKey) return;
        if (isEditableTarget(e.target)) return;

        e.preventDefault();

        if (e.key === ' ') {
            if (e.repeat) return;
            playing.value = !playing.value;
        } else if (e.key === 'ArrowRight') {
            currentTime.value += 10;
        } else if (e.key === 'ArrowLeft') {
            currentTime.value = Math.max(0, currentTime.value - 10);
        } else if (e.key === 'j') {
            currentTime.value = Math.max(0, currentTime.value - 10);
        } else if (e.key === 'k') {
            playing.value = !playing.value;
        } else if (e.key === 'l') {
            currentTime.value += 10;
        } else if (e.key === 'ArrowUp') {
            volume.value = Math.min(1, volume.value + 0.1);
        } else if (e.key === 'ArrowDown') {
            volume.value = Math.max(0, volume.value - 0.1);
        }
    });

    onPlaybackError(async (e) => {
        playing.value = false;
    });

    watch(videoRef, () => {
        if (!videoRef.value) return;

        videoRef.value.onerror = (e) => {
            srcNotFound.value = true;
        };
    });

    watch(idle, (isIdle) => {
        if (!playing.value) return;
        if (videoColScrollY.value < 120) videoColScrollToTop();
        showControllsAndInfo.value = false;
    });

    watchEffect(() => {
        if (!waiting.value) playing.value = true;
    });

    watch(waiting, (isWaiting) => {
        if (isWaiting) {
            showControllsAndInfo.value = true;
        }
    });

    watch(volume, () => {
        muted.value = false;
    });

    watch(volume, (v) => {
        persistedVolume.value = v;
    });

    watch(currentTimeRounded, (time) => {
        if (time % 5 !== 0) return;
        historyStore.upsert(video.value.id, time);
    });

    watch(persistedVolume, (v) => {
        if (v !== volume.value) volume.value = v;
    });

    //
    // messages
    //
    const messages = ref<Message[]>([]);
    const messagesLoading = ref(true);
    const subCount = computed(
        () =>
            messages.value.filter(
                (m) =>
                    m.text.includes(`subscribed at`) ||
                    m.text.includes('subscribed with') ||
                    m.text.includes('gifted a') ||
                    m.text.includes('is gifting')
            ).length
    );

    const giftSubs = computed(() => {
        return messages.value
            .filter((m) => m.text.includes('gifted a') || m.text.includes('is gifting'))
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

    const messagesPerPercent = computed(() => {
        const lengthSec = video.value?.length_sec;
        if (!lengthSec || !messages.value.length) return [];

        const pointCount = 120;
        const points = Array<number>(pointCount).fill(0);

        if (!messages.value.length) return points;

        for (const message of messages.value) {
            if (!message.text.includes(':emote;')) continue;
            if (message.text.includes(':emote;lekkerDag')) continue;
            if (message.offset_sec < 60) continue;
            if (video.value.length_sec - message.offset_sec < 60) continue;

            const words = message.text.split(' ');
            const emoteAmount = words.filter((word) => word.startsWith(':emote;')).length;
            const messageWeigth = 3;
            const offsetSec = Number(message.offset_sec);
            const percent = (offsetSec / lengthSec) * pointCount;
            const pointIndex = Math.min(pointCount - 1, Math.floor(percent));

            if (pointIndex < 0 || pointIndex >= pointCount) continue;
            const score = messageWeigth + emoteAmount;
            points[pointIndex] += score * score;
        }

        const maxValue = Math.max(...points, 1);

        const foo = points.map((point) => {
            let percentage = Math.round((point / maxValue) * 100);
            // if (percentage < 33) percentage = percentage / 2;
            return Math.round(percentage);
        });
        console.log(foo);
        return foo;
    });

    async function fetchMessages() {
        const videoId = Number(id.value);

        const { data: messagesData, error: messagesError } = await fetchAll((from, to) =>
            supabase
                .from('messages')
                .select(messagesQueryStringSelect)
                .eq('video_id', videoId)
                .order('offset_sec', { ascending: true })
                .range(from, to)
        );
        if (messagesError) throw messagesError;

        const { data: badgesData, error: badgesError } = await fetchAll((from, to) =>
            supabase.from('message_twitch_badges').select('user_id, image_id').eq('video_id', videoId).range(from, to)
        );
        if (badgesError) throw badgesError;

        const badgesByUser = badgesData.reduce(
            (acc, badge) => {
                if (!acc[badge.user_id]) acc[badge.user_id] = [];
                acc[badge.user_id].push({ image_id: badge.image_id });
                return acc;
            },
            {} as Record<string, Array<{ image_id: string }>>
        );

        messages.value = messagesData.map((msg) => ({
            ...msg,
            badges: badgesByUser[msg.user_id] || [],
        }));

        messagesLoading.value = false;
    }

    //
    // playlist
    //
    const playlistId = ref<string>();
    const playlist = computed(() => {
        if (playlistId.value) {
            return playlistsStore.playlists.find((p) => p.id === playlistId.value);
        } else {
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

    //
    // lifecycle
    //
    onMounted(() => {
        if (persistedVolume.value !== null && persistedVolume.value !== undefined) {
            volume.value = persistedVolume.value;
        }
    });

    return {
        //
        // layout
        //
        theaterMode,
        showChat,
        casting,
        showWidgetsMobile,
        videoColRef,
        videoColScrollToTop,

        //
        // video
        //
        video,
        id,
        src,
        srcNotFound,
        chapters,
        init,
        reset,
        setVideoRef,

        //
        // player
        //
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
        supportsPictureInPicture,
        isPictureInPicture,
        togglePictureInPicture,
        currentTimeRounded,
        prettyCurrentTime,
        prettyDuration,
        playerIsActive,
        playerIsMini,
        isFullscreen,
        setSrc,
        loadVideoProgression,
        toggleFullscreen,
        enterFullscreen,
        exitFullscreen,
        setTimePrior,
        getTimePrior,
        onSourceError,
        onPlaybackError,

        //
        // messages
        //
        messages,
        messagesLoading,
        subCount,
        giftSubs,
        messagesPerPercent,
        fetchMessages,

        //
        // playlist
        //
        playlistId,
        playlist,
        playlistNextVideo,
        playlistPrevVideo,
    };
});
