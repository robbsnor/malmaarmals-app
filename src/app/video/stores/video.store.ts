import { defineStore } from 'pinia';
import { computed, onMounted, ref, useTemplateRef, watch, type ShallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import type { VideoProgression } from '../models/VideoProgression.model';
import { TitleHelper } from '../../shared/helpers/title.helper';
import { CHAPTERS_MOCK } from '../data/chapters.mock';
import { useMediaControls } from '@vueuse/core';

export const useVideoStore = defineStore('video', () => {
    const videoInfo = ref<Tables<'videos'>>();
    const videoId = ref('');
    const chapters = ref(CHAPTERS_MOCK);
    const showInfo = ref(false);
    const messages = ref<Tables<'messages'>[]>([]);
    const videoRef = ref<HTMLVideoElement>();
    const mediaControls = useMediaControls(videoRef);

    const subCount = computed(
        () => messages.value.filter((m) => m.text.includes('subscribed') || m.text.includes('gifted a')).length
    );

    const videoSrc = computed(() => `http://localhost:8000/videos/${videoId.value}`);
    const fetchVideoInfo = async () => {
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
            const { data, error, count } = await supabase
                .from('messages')
                .select('user_login,user_name,user_color,text,offset_sec,id', {
                    count: 'exact',
                })
                .eq('video_id', Number(videoId.value))
                .order('offset_sec', { ascending: true })
                .range(from, to);

            if (error) {
                return console.error('Error fetching messages:', error);
            }

            if (data && data.length > 0) {
                // @ts-ignore
                // messages.value = [...messages.value, ...data];
                from += 1000;
                to += 1000;
                hasMore = data.length === 1000;
            } else {
                hasMore = false;
            }
        }
    };

    const seekToTime = (seconds: number) => {
        // playerRef.value.videoRef.currentTime = seconds;
        // playerRef.value.videoRef.play();
    };

    const setVideoRef = (el: HTMLVideoElement) => {
        videoRef.value = el;
    };

    // watch(videoTime, (newValue) => {
    //     const obj: VideoProgression = {
    //         current_time_s: newValue,
    //         total_time_s: videoInfo.value.length_sec,
    //         percentage: Math.round((100 / videoInfo.value.length_sec) * videoTime.value),
    //     };

    //     localStorage.setItem(videoId.value, JSON.stringify(obj));
    // });

    return {
        videoInfo,
        videoId,
        chapters,
        videoSrc,
        showInfo,

        mediaControls,

        messages,
        subCount,

        fetchVideoInfo,
        fetchMessages,
        seekToTime,
        setVideoRef,
    };
});
