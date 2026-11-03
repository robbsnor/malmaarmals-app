import {
    onKeyStroke,
    useFullscreen,
    useIdle,
    useLocalStorage,
    useMediaControls,
    useScreenOrientation,
    useScroll,
    useStorage,
    useWindowSize,
} from '@vueuse/core';
import { defineStore } from 'pinia';
import { computed, onMounted, ref, watch, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import { useHistoryStore } from '../../history/stores/history.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { BucketHelper } from '../../shared/helpers/bucket.helper';
import { fetchAll } from '../../shared/helpers/supabase-fetch-all.helper';
import { TimeHelper } from '../../shared/helpers/time.helper';
import { messagesQueryStringSelect, type Message } from '../models/messages.model';
import { useVideosStore } from './videos.store';
import { useVideoStore } from './video.store';

export const TIME_PRIOR_OFFSET_S = 2;

export enum CHAT_MODE {
    SHOWN = 'SHOWN',
    OVERLAY = 'OVERLAY',
    HIDDEN = 'HIDDEN',
}

export const useMessagesStore = defineStore('messages', () => {
    const playlistsStore = usePlaylistsStore();
    const videoStore = useVideoStore();

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

    const uniqueUsers = computed(() => {
        const uniqueUsersMap = new Map<
            number,
            {
                user_id: number;
                user_name: string;
                user_color?: string;
                badges: Message['badges'];
            }
        >();

        messages.value.forEach(({ user_id, user_name, user_color, badges }) => {
            if (uniqueUsersMap.has(user_id)) return;
            uniqueUsersMap.set(user_id, {
                user_id,
                user_name,
                user_color,
                badges,
            });
        });

        return Array.from(uniqueUsersMap.values()).sort((a, b) =>
            String(a.user_name).localeCompare(String(b.user_name), undefined, { sensitivity: 'base' })
        );
    });

    const messagesPerPercent = computed(() => {
        const lengthSec = videoStore.video?.length_sec;
        if (!lengthSec || !messages.value.length) return [];

        const pointDurationSec = 40;
        const pointCount = Math.ceil(lengthSec / pointDurationSec);
        const points = Array<number>(pointCount).fill(0);

        for (const message of messages.value) {
            if (!message.text.includes(':emote;')) continue;
            if (message.text.includes(':emote;lekkerDag')) continue;
            if (message.offset_sec < 60) continue;
            if (videoStore.video.length_sec - message.offset_sec < 60) continue;

            const words = message.text.split(' ');
            const emoteAmount = words.filter((word) => word.startsWith(':emote;')).length;
            const messageWeigth = 3;
            const offsetSec = Number(message.offset_sec);
            const pointIndex = Math.floor(offsetSec / pointDurationSec);

            if (pointIndex < 0 || pointIndex >= pointCount) continue;
            const score = messageWeigth + emoteAmount;
            points[pointIndex] += score;
        }

        const maxValue = Math.max(...points, 1);

        return points.map((point) => {
            let percentage = Math.round((point / maxValue) * 100);
            return Math.round(percentage);
        });
    });

    async function fetchMessages() {
        const videoId = Number(videoStore.id);

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

    return {
        messages,
        messagesLoading,
        subCount,
        giftSubs,
        uniqueUsers,
        messagesPerPercent,
        fetchMessages,
    };
});
