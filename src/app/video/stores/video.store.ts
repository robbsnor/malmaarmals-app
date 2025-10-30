import { defineStore } from 'pinia';
import { computed, onMounted, ref, useTemplateRef, watch, watchEffect, type ShallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import type { VideoProgression } from '../models/VideoProgression.model';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { CHAPTERS_MOCK } from '../data/chapters.mock';
import { useIdle, useMediaControls } from '@vueuse/core';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { BucketHelper } from '../../shared/helpers/bucket.helper';

export const useVideoStore = defineStore('video', () => {
    const videoInfo = ref<Tables<'videos'>>();
    const videoId = ref('');
    const chapters = ref(CHAPTERS_MOCK);
    const showControllsAndInfo = ref(true);
    const messages = ref<Tables<'messages'>[]>([]);
    const player = ref({
        isActive: false,
        isMini: true,
    });
    const { idle, lastActive } = useIdle(7 * 1000);
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
    const videoSrc = computed(() => BucketHelper.getVideoUrl(Number(videoId.value)));
    const prettyCurrentTime = computed(() => TimeHelper.formatTime(currentTime.value));
    const prettyDuration = computed(() => TimeHelper.formatTime(duration.value));
    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );

    const fetchVideoInfo = async () => {
        videoInfo.value = null;

        const { data, error } = await supabase
            .from('videos')
            .select('*')
            .eq('video_id', Number(videoId.value))
            .single();
        if (error) return console.error('Error fetching videos:', error);

        videoInfo.value = data;
        TitleHelper.setTitle(data.title);
    };

    const fetchMessages = async () => {
        messages.value = [];

        let from = 0;
        let to = 999;
        let hasMore = true;

        while (hasMore) {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('video_id', Number(videoId.value))
                .order('offset_sec', { ascending: true })
                .range(from, to);

            if (error) {
                return console.error('Error fetching messages:', error);
            }

            if (data && data.length > 0) {
                messages.value = [...messages.value, ...data];
                from += 1000;
                to += 1000;
                hasMore = data.length === 1000;
            } else {
                hasMore = false;
            }
        }
    };

    const setVideoRef = (el: HTMLVideoElement) => {
        videoRef.value = el;
    };

    function reset() {
        currentTime.value = 0;
        duration.value = 0;
        messages.value = [];
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

    return {
        videoInfo,
        videoId,
        chapters,
        videoSrc,
        showControllsAndInfo,
        messages,
        subCount,
        prettyCurrentTime,
        prettyDuration,
        showMobileControls,
        player,

        // mediaControls
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

        fetchVideoInfo,
        fetchMessages,
        setVideoRef,
        loadVideoProgression,
        reset,
    };
});
