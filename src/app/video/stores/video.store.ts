import { defineStore } from 'pinia';
import { computed, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/models/database.types';
import type { VideoProgression } from '../models/VideoProgression.model';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { useIdle, useMediaControls } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { type ChaptersWithCategory } from '../models/chapters-with-category.model';
import _ from 'lodash';
import type { Messages } from '../models/messages.model';

export const TIME_PRIOR_OFFSET_S = 2;

export const useVideoStore = defineStore('video', () => {
    const videoInfo = ref<Tables<'videos'>>();
    const videoId = ref<number>();

    const chaptersOG = ref<ChaptersWithCategory>();
    const chapters = ref<ChaptersWithCategory>();
    const hasChapterChanges = computed(() => !_.isEqual(chapters.value, chaptersOG.value));
    const showChapterManager = ref(false);

    const showControllsAndInfo = ref(true);
    const messages = ref<Messages>([]);
    const player = ref({
        isActive: false,
        isMini: true,
    });
    const { idle } = useIdle(7 * 1000);
    const videoRef = ref<HTMLVideoElement>();
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
    } = useMediaControls(videoRef);
    const showMobileControls = ref(true);
    const videoSrc = computed(() => BucketHelper.getVideoUrl(videoId.value));
    const prettyCurrentTime = computed(() => TimeHelper.formatTime(currentTime.value));
    const prettyDuration = computed(() => TimeHelper.formatTime(duration.value));
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );
    const currentTimeRounded = computed(() => {
        console.log('updated');
        console.log(currentTime.value);
        return Math.floor(currentTime.value);
    });

    async function fetchVideoInfo() {
        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('video_id', Number(videoId.value))
            .single();
        if (error) throw error;

        videoInfo.value = data;
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
        let from = 0;
        let to = 999;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('messages')
                .select('message_id, offset_sec, text, user_color, user_name')
                .eq('video_id', Number(videoId.value))
                .order('offset_sec', { ascending: true })
                .range(from, to);

            if (error) throw error;

            if (data && data.length > 0) {
                messages.value = [...messages.value, ...data];
                from += 1000;
                to += 1000;
                hasMore = data.length === 1000;
            } else {
                hasMore = false;
            }
        }
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
    }

    const saveVideoProgression = (newTime: number) => {
        // const obj: VideoProgression = {
        //     current_time_s: newTime,
        //     total_time_s: videoInfo.value.length_sec,
        //     percentage: Math.round((100 / videoInfo.value.length_sec) * currentTime.value),
        // };
        // localStorage.setItem(videoId.value, JSON.stringify(obj));
    };

    const loadVideoProgression = () => {
        // const timeObj: VideoProgression = JSON.parse(localStorage.getItem(videoId.value));
        // if (!timeObj) return;
        // currentTime.value = Number(timeObj.current_time_s);
    };

    function resetChaptersForm() {
        chapters.value = _.cloneDeep(chaptersOG.value);
    }

    watch(currentTime, (newTime) => {
        saveVideoProgression(newTime);
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

    return {
        videoInfo,
        videoId,
        chaptersOG,
        chapters,
        videoSrc,
        showControllsAndInfo,
        showChapterManager,
        hasChapterChanges,
        messages,
        subCount,
        prettyCurrentTime,
        prettyDuration,
        showMobileControls,
        player,

        // mediaControls
        currentTime,
        currentTimeRounded,
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

        fetchVideoInfo,
        fetchChapters,
        fetchMessages,
        resetChaptersForm,
        setVideoRef,
        setTimePrior,
        getTimePrior,
        loadVideoProgression,
        reset,
    };
});
