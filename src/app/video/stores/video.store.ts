import { defineStore } from 'pinia';
import { computed, nextTick, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/models/database.types';
import type { VideoProgression } from '../models/video-progression.model';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { useIdle, useMediaControls } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { type ChaptersWithCategory } from '../models/chapters-with-category.model';
import _, { round } from 'lodash';
import type { Messages } from '../models/messages.model';
import { v4 } from 'uuid';
import { useAuthStore } from '../../auth/stores/auth.store';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const authStore = useAuthStore();
    const videoInfo = ref<Tables<'videos'>>();
    const videoId = ref<number>();
    const videoInfoLoading = ref(true);

    const chaptersOG = ref<ChaptersWithCategory>();
    const chapters = ref<ChaptersWithCategory>();
    const hasChapterChanges = computed(() => !_.isEqual(chapters.value, chaptersOG.value));
    const editMode = ref(false);
    const showChapterDrawer = ref(false);

    const showControllsAndInfo = ref(true);
    const messages = ref<Messages>([]);
    const messagesLoading = ref(true);
    const player = ref({
        isActive: false,
        isMini: true,
    });
    const { idle } = useIdle(7 * 1000);
    const videoRef = ref<HTMLVideoElement | null>(null);
    const videoSrc = computed(() => BucketHelper.getVideoUrl(videoInfo.value.rotating_id));
    const videoSrcNotFound = ref(false);
    // prettier-ignore
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
    const showMobileControls = ref(true);
    const prettyCurrentTime = computed(() => TimeHelper.formatTime(currentTime.value));
    const prettyDuration = computed(() => TimeHelper.formatTime(duration.value));
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );
    const currentTimeRounded = computed(() => Math.floor(currentTime.value));

    onPlaybackError(async (e) => {
        playing.value = false;
    });

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
        editMode.value = false;
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
        TitleHelper.setTitle(data.title);
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

    watch(currentTimeRounded, () => {
        saveVideoProgression();
    });

    watch(videoRef, () => {
        if (!videoRef.value) return;

        videoRef.value.onerror = (e) => {
            videoSrcNotFound.value = true;
        };
    });

    watch(idle, (isIdle) => {
        if (!playing.value) return;
        if (!isIdle) return;
        showControllsAndInfo.value = false;
    });

    watchEffect(() => {
        // auto play when done loading
        if (!waiting.value) playing.value = true;
    });

    watch(
        () => chapters.value,
        (newChapters) => {
            // sort chapters by start_s
            if (!newChapters) return;
            newChapters.sort((a, b) => a.start_s - b.start_s);
        },
        { deep: true }
    );

    watchEffect(() => {
        // close mini player when video not found
        if (player.value.isMini && videoSrcNotFound.value) {
            player.value.isActive = false;
        }
    });

    watch(volume, () => {
        muted.value = false;
    });

    return {
        videoInfo,
        videoId,
        videoInfoLoading,
        subCount,

        // player
        player,
        videoRef,
        showMobileControls,
        showControllsAndInfo,
        videoSrc,
        videoSrcNotFound,

        // mediaControls
        currentTime,
        prettyCurrentTime,
        currentTimeRounded,
        duration,
        prettyDuration,
        playing,
        waiting,
        seeking,
        ended,
        stalled,
        buffered,
        rate,
        volume,
        muted,

        // messages
        messages,
        messagesLoading,

        // chapters
        chaptersOG,
        chapters,
        showChapterDrawer,
        hasChapterChanges,
        editMode,

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
