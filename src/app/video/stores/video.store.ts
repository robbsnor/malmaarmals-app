import { defineStore } from 'pinia';
import { computed, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/models/database.types';
import type { VideoProgression } from '../models/video-progression.model';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { useIdle, useMediaControls } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { type ChaptersWithCategory } from '../models/chapters-with-category.model';
import _ from 'lodash';
import type { Messages } from '../models/messages.model';
import { v4 } from 'uuid';
import { useAuthStore } from '../../auth/stores/auth.store';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const authStore = useAuthStore();

    // video info
    const videoInfo = ref<Tables<'videos'>>();
    const videoId = ref<number>();
    const videoInfoLoading = ref(true);

    // chapters
    const chaptersOG = ref<ChaptersWithCategory>();
    const chapters = ref<ChaptersWithCategory>();
    const hasChapterChanges = computed(() => !_.isEqual(chapters.value, chaptersOG.value));
    const chaptersEditMode = ref(false);
    const showChapterDrawer = ref(false);

    // messages
    const messages = ref<Messages>([]);
    const messagesLoading = ref(true);
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );

    // video player
    const showControllsAndInfo = ref(true);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const videoSrc = computed(() => BucketHelper.getVideoUrl(videoInfo.value.rotating_id));
    const videoSrcNotFound = ref(false);
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

    // functions
    function reset() {
        chaptersOG.value = null;
        chapters.value = null;
        videoInfo.value = null;
        currentTime.value = 0;
        duration.value = 0;
        messages.value = [];
        videoId.value = null;
        chapters.value = null;
        videoInfo.value = null;
        playing.value = false;
        chaptersEditMode.value = false;
        messagesLoading.value = true;
        videoInfoLoading.value = true;
        videoSrcNotFound.value = false;
    }

    async function fetchVideoInfo() {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('video_id', Number(videoId.value))
            .single();
        if (error) throw error;

        videoInfo.value = data;
        videoInfoLoading.value = false;
    }

    async function fetchChapters() {
        const { data, error } = await supabase
            .from('chapters')
            .select('*, category:categories(*)')
            .order('start_s', { ascending: true })
            .eq('video_id', videoId.value);

        if (error) throw error;

        chaptersOG.value = _.cloneDeep(data);
        chapters.value = _.cloneDeep(data);
    }

    async function fetchMessages() {
        const { data, error } = await supabase
            .from('messages')
            .select('message_id, offset_sec, text, user_color, user_name')
            .eq('video_id', Number(videoId.value))
            .order('offset_sec', { ascending: true });

        messagesLoading.value = false;

        if (error) throw error;
        messages.value = data;
    }

    function setVideoRef(el: HTMLVideoElement) {
        videoRef.value = el;
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
            video_id: videoId.value,
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
            total_time_s: videoInfo.value.length_sec,
            percentage: Math.round((100 / videoInfo.value.length_sec) * currentTimeRounded.value),
        };
        localStorage.setItem(videoId.value.toString(), JSON.stringify(obj));
    };

    const loadVideoProgression = () => {
        const timeObj: VideoProgression = JSON.parse(localStorage.getItem(videoId.value.toString()));
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
            videoSrcNotFound.value = true;
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
        if (playerIsMini.value && videoSrcNotFound.value) {
            playerIsActive.value = false;
        }
    });

    watch(volume, () => {
        muted.value = false;
    });

    return {
        // video
        videoInfo,
        videoId,
        videoInfoLoading,
        videoSrc,
        videoSrcNotFound,

        // chapters
        chapters,
        chaptersEditMode,
        showChapterDrawer,
        hasChapterChanges,

        // messages
        messages,
        messagesLoading,
        subCount,

        // video
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

        // functions
        fetchVideoInfo,
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
