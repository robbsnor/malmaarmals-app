import { LEKKER_SPELEN_USER_ID, useAuthStore } from '../../auth/stores/auth.store';
import { supabase } from '../../../supabase';
import type { TwitchGetFollowedStreams } from '../models/twitch/followed-streams.model';
import type { TwitchCheckUserSubscription } from '../models/twitch/check-user-subscription.model';

export function useTwitch() {
    const authStore = useAuthStore();

    async function refreshTokens() {
        if (!authStore.session) {
            throw new Error('No session available for Twitch token refresh');
        }

        if (!authStore.twitchRefreshToken) {
            throw new Error('Missing Twitch refresh token');
        }

        console.log('Refreshing Twitch tokens...');

        try {
            const { data, error } = await supabase.functions.invoke('refresh-twitch-token', {
                body: {
                    refresh_token: authStore.twitchRefreshToken,
                },
            });

            if (error) {
                throw error;
            }

            const { access_token, refresh_token } = data;

            authStore.twitchAccessToken = access_token;

            if (refresh_token) {
                authStore.twitchRefreshToken = refresh_token;
            }

            console.log('Twitch tokens refreshed');
        } catch (err) {
            console.error('Twitch token refresh failed:', err);
            throw err instanceof Error ? err : new Error(String(err));
        }
    }

    const req = async <T>(
        url: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    ): Promise<{
        data: T | null;
        error: Error | null;
    }> => {
        if (!authStore.session) {
            return { data: null, error: new Error('Not logged in') };
        }

        if (!authStore.twitchAccessToken) {
            console.error('Missing Twitch access token');
            return { data: null, error: new Error('Missing Twitch access token') };
        }

        const doRequest = () =>
            fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${authStore.twitchAccessToken}`,
                    'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID,
                },
            });

        try {
            let res = await doRequest();

            if (res.status === 401) {
                if (!authStore.twitchRefreshToken) {
                    console.error('Access token expired, but no Twitch refresh token available');
                    return { data: null, error: new Error('Missing Twitch refresh token') };
                }

                try {
                    console.log('Access token expired, refreshing...');
                    await refreshTokens();
                } catch (refreshErr) {
                    console.error('Refresh token failed:', refreshErr);
                    return { data: null, error: refreshErr as Error };
                }

                res = await doRequest();
            }

            if (!res.ok) {
                const message = `HTTP ${res.status}: ${res.statusText}`;
                return { data: null, error: new Error(message) };
            }

            const data: T = await res.json();

            return { data, error: null };
        } catch (err) {
            console.error('Twitch request failed:', err);
            return { data: null, error: err as Error };
        }
    };

    function getFollowedStreams() {
        const url = new URL('https://api.twitch.tv/helix/streams/followed');

        url.searchParams.set('user_id', '23611469');
        url.searchParams.set('first', '1');

        return req<TwitchGetFollowedStreams>(url.toString());
    }

    function getGlobalChatBadges() {
        const url = new URL('https://api.twitch.tv/helix/chat/badges/global');

        return req<any>(url.toString());
    }

    function getChannelBadges() {
        const url = new URL('https://api.twitch.tv/helix/chat/badges');

        url.searchParams.set('broadcaster_id', LEKKER_SPELEN_USER_ID.toString());

        return req<any>(url.toString());
    }

    function checkUserSubscription(broadcasterId: number) {
        const userId = Number(authStore.twitchUserId);

        if (!userId || Number.isNaN(userId)) {
            return Promise.resolve({
                data: null,
                error: new Error('Missing Twitch user id'),
            });
        }

        const url = new URL('https://api.twitch.tv/helix/subscriptions/user');

        url.searchParams.set('broadcaster_id', broadcasterId.toString());
        url.searchParams.set('user_id', userId.toString());

        return req<TwitchCheckUserSubscription>(url.toString());
    }

    return {
        getFollowedStreams,
        getGlobalChatBadges,
        getChannelBadges,
        checkUserSubscription,
    };
}