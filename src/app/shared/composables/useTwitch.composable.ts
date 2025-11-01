import { useAuthStore } from '../../auth/stores/auth.store';
import { supabase } from '../../../supabase';
import type { TwitchFollowedStream, TwitchGetFollowedStreams } from '../models/twitch/followed-streams.model';
import type { TwitchCheckUserSubscription } from '../models/twitch/check-user-subscription.model';
import type { TwitchFollowedStreamWithUser } from '../models/twitch/followed-streams-with-user.model';
import type { TwitchGetUsers, TwitchUser } from '../models/twitch/users.model';
import type { TwitchGetVideos, TwitchVideo } from '../models/twitch/videos.model';
import type { TwitchGetFollowedChannels } from '../models/twitch/followed-channels.model';
import type { TwitchGetChannelFollowers } from '../models/twitch/channel-followers.model';
import type { TwitchGetStreams } from '../models/twitch/get-streams';
import type { TwitchGame, TwitchGetGames } from '../models/twitch/games.model';
import type { TwitchStreamsWithUser } from '../models/twitch/streams-with-user.model';
import type { TwitchGetSchedule, TwitchSchedule } from '../models/twitch/schedule.model';
import type { VideoTypesModel } from '../models/twitch/video-types.model';
import type { TwitchScheduleWithUser } from '../models/twitch/schedule-with-user.model';
import { createFetch, useFetch } from '@vueuse/core';

export function useTwitch() {
    const authStore = useAuthStore();

    const useMyFetch = createFetch({
        baseUrl: 'https://my-api.com',
        combination: 'overwrite',
        options: {
            // beforeFetch in pre-configured instance will only run when the newly spawned instance do not pass beforeFetch
            async beforeFetch({ url, options, cancel }) {
                console.log('accesstoken before fetch: ', authStore.twitchAccessToken);

                if (!authStore.session) {
                    cancel();
                }

                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authStore.twitchAccessToken}`,
                    'Client-Id': `${import.meta.env.VITE_TWITCH_CLIENT_ID}`,
                };

                return {
                    options,
                };
            },
        },
    });

    const req = async <T>(
        url: string
    ): Promise<{
        data: T | null;
        error: Error | null;
    }> => {
        if (!authStore.session) {
            return { data: null, error: new Error('Not logged in') };
        }

        if (!authStore.twitchAccessToken || !authStore.twitchRefreshToken) {
            await authStore.signOut();
            return { data: null, error: new Error('Missing Twitch tokens') };
        }

        const _req = () =>
            fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${authStore.twitchAccessToken}`,
                    'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID,
                },
            });

        try {
            let res = await _req();

            // Handle expired token (401)
            if (res.status === 401) {
                try {
                    console.log('Access token expired, refreshing...');
                    await refreshTokens();
                } catch (refreshErr) {
                    console.error('❌ Refresh token failed:', refreshErr);
                    await authStore.signOut();
                    return { data: null, error: refreshErr as Error };
                }

                // Retry request after successful refresh
                res = await _req();
            }

            // If still not OK, treat as an API error, res.ok is true for 200-299 status codes
            if (!res.ok) {
                const message = `HTTP ${res.status}: ${res.statusText}`;
                return { data: null, error: new Error(message) };
            }

            // Parse and return JSON safely
            const data: T = await res.json();
            return { data, error: null };
        } catch (err) {
            // Catches network errors or unexpected exceptions
            console.error('❌ Request failed:', err);
            return { data: null, error: err as Error };
        }
    };

    function get<T>(url: string) {
        return useFetch<T>(url, {
            immediate: true,
            async beforeFetch({ url, options, cancel }) {
                console.log('accesstoken before fetch: ', authStore.twitchAccessToken);

                if (!authStore.session) {
                    cancel();
                }

                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${authStore.twitchAccessToken}`,
                    'Client-Id': `${import.meta.env.VITE_TWITCH_CLIENT_ID}`,
                };

                return {
                    options,
                };
            },
            async afterFetch(ctx) {
                console.log(ctx);
                console.log(ctx);
                console.log(ctx);
                if (ctx.response.status === 401) {
                    // token expired
                    refreshTokens().catch((err) => {
                        console.error('Error refreshing tokens:', err);
                    });
                }
                return ctx;
            },
        }).json<T>();
    }

    async function refreshTokens() {
        if (!authStore.session || !authStore.twitchAccessToken || !authStore.twitchRefreshToken) {
            console.log('No session or tokens available for refresh');
            return;
        }
        console.log('Refreshing tokens...');

        try {
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refresh-twitch-token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: authStore.twitchRefreshToken,
                }),
            });

            const { access_token, refresh_token } = await res.json();
            console.log('new tokens:', {
                access_token,
                refresh_token,
            });

            authStore.twitchAccessToken = access_token;
            authStore.twitchRefreshToken = refresh_token;
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }

    function getFollowedStreams() {
        const url = new URL('https://api.twitch.tv/helix/streams/followed');
        url.searchParams.set('user_id', '23611469');
        url.searchParams.set('first', '1');
        return req<TwitchGetFollowedStreams>(url.toString());
    }

    const checkUserSubscription = (broadcasterId: string) => {
        const url = new URL('https://api.twitch.tv/helix/subscriptions/user');
        url.searchParams.set('broadcaster_id', broadcasterId);
        url.searchParams.set('user_id', authStore.twitchUserId);
        return req<TwitchCheckUserSubscription>(url.toString());
    };

    // const getUsers = async (user: { ids?: number[]; logins?: string[] }): Promise<TwitchGetUsers> => {
    //     const url = new URL('https://api.twitch.tv/helix/users');
    //     if (user.ids) user.ids.forEach((id) => url.searchParams.append('id', id.toString()));
    //     if (user.logins) user.logins.forEach((login) => url.searchParams.append('login', login));

    //     const res = await get<TwitchGetUsers>(url.toString());
    //     if (res.data.data.length === 0) throw new Error('No users found');

    //     const unorderedUsers = res.data.data;
    //     let orderedUsers: TwitchUser[] = [];

    //     // it will find one
    //     if (user.ids) {
    //         // @ts-ignore
    //         orderedUsers = user.ids.map((userId) => {
    //             return unorderedUsers.find((unorderedUser) => Number(unorderedUser.id) === userId);
    //         });
    //     }

    //     if (user.logins) {
    //         // @ts-ignore
    //         orderedUsers = user.logins.map((user) => {
    //             return unorderedUsers.find((unorderedUser) => unorderedUser.login === user.toLocaleLowerCase());
    //         });
    //     }

    //     res.data.value.data = orderedUsers;
    //     return res.data.value.data;
    // };

    // const getFollowedStreams = () => {
    //     const url = new URL('https://api.twitch.tv/helix/streams/followed');
    //     const userId = authStore.session.user.user_metadata.provider_id;
    //     url.searchParams.append('user_id', userId);
    //     return get<TwitchGetFollowedStreams>(url.toString());
    // };

    // const getFollowedStreamsWithUser = async (): Promise<TwitchFollowedStreamWithUser[]> => {
    //     const followedStreams = await getFollowedStreams();
    //     const userIds = followedStreams.map((stream) => Number(stream.user_id));
    //     const users = (await getUsers({ ids: userIds })).data;
    //     const streamsWithUser = followedStreams.map<TwitchFollowedStreamWithUser>((stream, index) => {
    //         return {
    //             ...followedStreams[index],
    //             ...users[index],
    //         };
    //     });
    //     return streamsWithUser;
    // };

    // const getFollowedChannels = async (userId: number, broadcasterId?: number): Promise<TwitchGetFollowedChannels> => {
    //     const url = new URL('https://api.twitch.tv/helix/channels/followed');
    //     url.searchParams.append('user_id', userId.toString());
    //     if (broadcasterId) url.searchParams.append('broadcaster_id', broadcasterId.toString());

    //     const res = await get<TwitchGetFollowedChannels>(url.toString());
    //     return res.data;
    // };

    // const getVideosByUserId = async (
    //     userId: number,
    //     type: VideoTypesModel = 'all',
    //     after?: string, // cursor
    //     amount: number = 20
    //     // options?: TwitchGetVideosOptions,
    // ): Promise<TwitchGetVideos> => {
    //     const url = new URL('https://api.twitch.tv/helix/videos');
    //     url.searchParams.append('user_id', userId.toString());
    //     url.searchParams.append('type', type);
    //     url.searchParams.append('first', amount.toString());
    //     if (after) url.searchParams.append('after', after);

    //     const res = await get<TwitchGetVideos>(url.toString());
    //     return res.data;
    // };

    // const getVideosByVideoIds = async (ids: number[]): Promise<TwitchGetVideos | { data: never[] }> => {
    //     const url = new URL('https://api.twitch.tv/helix/videos');
    //     if (ids.length > 100) ids = ids.slice(0, 100);
    //     if (ids.length === 0) return { data: [] };

    //     ids.forEach((id) => url.searchParams.append('id', id.toString()));
    //     const res = await get<TwitchGetVideos>(url.toString());
    //     const unorderedVideos = res.data.data;

    //     const orderedVideos: TwitchVideo[] = ids.reduce((acc: TwitchVideo[], id: number) => {
    //         const video = unorderedVideos.find((unorderedVideo) => Number(unorderedVideo.id) === id);
    //         if (video) acc.push(video);
    //         return acc;
    //     }, []);

    //     res.data.data = orderedVideos;
    //     return res.data;
    // };

    // const getChannelFollowers = async (broadcasterId: number): Promise<TwitchGetChannelFollowers> => {
    //     const url = new URL('https://api.twitch.tv/helix/channels/followers');
    //     url.searchParams.append('broadcaster_id', broadcasterId.toString());

    //     const res = await get<TwitchGetChannelFollowers>(url.toString());
    //     return res.data;
    // };

    // const getGames = async (game: { ids?: number[]; names?: string[] }): Promise<TwitchGetGames> => {
    //     const url = new URL('https://api.twitch.tv/helix/games');
    //     if (game.ids) game.ids.forEach((id) => url.searchParams.append('id', id.toString()));
    //     if (game.names) game.names.forEach((name) => url.searchParams.append('name', name));

    //     const res = await get<TwitchGetGames>(url.toString());

    //     let orderedGames: TwitchGame[] = [];

    //     // the ordering of the games could look prettier
    //     if (game.ids) {
    //         orderedGames = game.ids
    //             .map((gameId) => res.data.data.find((game) => Number(game.id) === gameId))
    //             .filter(Boolean) as TwitchGame[];
    //     }

    //     if (game.names) {
    //         orderedGames = game.names
    //             .map((gameName) => res.data.data.find((game) => game.name.toLowerCase() === gameName.toLowerCase()))
    //             .filter(Boolean) as TwitchGame[];
    //     }

    //     res.data.data = orderedGames;
    //     return res.data;
    // };

    // const getStreamsByGameIds = async (ids: number[]): Promise<TwitchGetStreams> => {
    //     const url = new URL('https://api.twitch.tv/helix/streams');
    //     ids.forEach((id) => url.searchParams.append('game_id', id.toString()));
    //     url.searchParams.append('first', '100');

    //     const res = await get<TwitchGetStreams>(url.toString());
    //     return res.data;
    // };

    // const getStreamsByGameIdWithUsers = async (id: number): Promise<TwitchStreamsWithUser[]> => {
    //     const streams = (await getStreamsByGameIds([id])).data;
    //     const userIds = streams.map((stream) => Number(stream.user_id));
    //     const users = (await getUsers({ ids: userIds })).data;
    //     const streamsWithUser = streams.map<TwitchStreamsWithUser>((stream, index) => {
    //         return {
    //             ...streams[index],
    //             ...users[index],
    //         };
    //     });
    //     return streamsWithUser;
    // };

    // const getSchedules = async (userIds: number[], amount = 25): Promise<TwitchSchedule[]> => {
    //     const promises = userIds.map(async (userId) => {
    //         const url = new URL('https://api.twitch.tv/helix/schedule');
    //         url.searchParams.append('broadcaster_id', userId.toString());
    //         url.searchParams.append('first', amount.toString());
    //         return await get<TwitchGetSchedule>(url.toString()).catch(() => null);
    //     });

    //     return (await Promise.all(promises)).filter(Boolean).map((res) => res!.data.data);
    // };

    // const getScheduleWithUsers = async (userIds: number[]): Promise<TwitchScheduleWithUser[]> => {
    //     const schedules = await getSchedules(userIds);
    //     const userIdsWithSchedules = schedules.map((schedule) => Number(schedule.broadcaster_id));
    //     const usersWithSchedules = (await getUsers({ ids: userIdsWithSchedules })).data;

    //     return usersWithSchedules.map((user) => {
    //         const schedule = schedules.find((schedule) => Number(schedule.broadcaster_id) === Number(user.id))!;

    //         return { schedule, user };
    //     });
    // };

    return {
        getFollowedStreams,
        checkUserSubscription,
    };
}
