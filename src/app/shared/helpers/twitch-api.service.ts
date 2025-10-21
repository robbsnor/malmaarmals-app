import { useAuthStore } from '../../auth/stores/auth.store';
import type { TwitchGetUsers, TwitchUser } from '../models/twitch/users.model';
import type { TwitchGetVideos, TwitchVideo } from '../models/twitch/videos.model';
import type { TwitchGetFollowedChannels } from '../models/twitch/followed-channels.model';
import type { TwitchCheckUserSubscription } from '../models/twitch/check-user-subscription.model';
import type { TwitchGetChannelFollowers } from '../models/twitch/channel-followers.model';
import type { VideoTypesModel } from '../models/twitch/video-types.model';
import type { TwitchGetStreams } from '../models/twitch/get-streams';
import type { TwitchGame, TwitchGetGames } from '../models/twitch/games.model';
import type { TwitchFollowedStream, TwitchGetFollowedStreams } from '../models/twitch/followed-streams.model';
import type { TwitchFollowedStreamWithUser } from '../models/twitch/followed-streams-with-user.model';
import type { TwitchStreamsWithUser } from '../models/twitch/streams-with-user.model';
import type { TwitchGetSchedule, TwitchSchedule } from '../models/twitch/schedule.model';
import type { TwitchScheduleWithUser } from '../models/twitch/schedule-with-user.model';

export function useTwitch() {
    const authStore = useAuthStore();

    const req = async (url: string) => {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${authStore.twitchAccessToken}`,
                'Client-Id': import.meta.env.VITE_TWITCH_CLIENT_ID,
            },
        });

        if (res.status === 401) {
            // console.log('refreshing', authStore.twitchAccessToken);
            console.log('session shit invalid: ', authStore.twitchAccessToken, authStore.twitchRefreshToken);
            // await authStore.refreshTwitchToken();
            return;
        }

        return res;
    };

    const checkUserSubscription = async (channelId: number) => {
        const res = await req(
            `https://api.twitch.tv/helix/subscriptions/user?broadcaster_id=${channelId}&user_id=${authStore.session.user.user_metadata.provider_id}`
        );
        if (res.status === 404) return false;
        return !!(await res.json());
    };

    async function refreshTokens() {
        if (!authStore.twitchRefreshToken || !authStore.twitchAccessToken) return;

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
        console.log({
            access_token,
            refresh_token,
        });

        authStore.twitchAccessToken = access_token;
        authStore.twitchRefreshToken = refresh_token;
    }

    const getMe = async (): Promise<TwitchUser> => {
        const url = new URL('https://api.twitch.tv/helix/users');
        url.searchParams.append('id', authStore.session.user.user_metadata.sub);
        const res = await req(url.toString());
        const data: TwitchGetUsers = await res.json();
        return data.data[0];
    };

    return {
        checkUserSubscription,
        refreshTokens,
        getMe,
    };
}

// export class TwitchApiService {
//     private accessToken: string;
//     private authStore = useAuthStore();

//     // constructor(accessToken?: string) {
//     //     this.accessToken = accessToken ?? this.authStore.accessToken!;

//     //     this.http.interceptors.request.use((config) => {
//     //         config.headers.set('Authorization', `Bearer ${this.accessToken}`);
//     //         config.headers.set('Client-Id', `bpjttmchlxdfo9t47z8g3b7snhr9h4`);
//     //         return config;
//     //     });
//     // }

//     // api calls
//     public async getUsers(user: { ids?: number[]; logins?: string[] }): Promise<TwitchGetUsers> {
//         const url = new URL('https://api.twitch.tv/helix/users');
//         if (user.ids) user.ids.forEach((id) => url.searchParams.append('id', id.toString()));
//         if (user.logins) user.logins.forEach((login) => url.searchParams.append('login', login));

//         const res = await this.http.get<TwitchGetUsers>(url.toString());
//         if (res.data.data.length === 0) throw new Error('No users found');

//         const unorderedUsers = res.data.data;
//         let orderedUsers: TwitchUser[] = [];

//         // it will find one
//         if (user.ids) {
//             // @ts-ignore
//             orderedUsers = user.ids.map((userId) => {
//                 return unorderedUsers.find((unorderedUser) => Number(unorderedUser.id) === userId);
//             });
//         }

//         if (user.logins) {
//             // @ts-ignore
//             orderedUsers = user.logins.map((user) => {
//                 return unorderedUsers.find((unorderedUser) => unorderedUser.login === user.toLocaleLowerCase());
//             });
//         }

//         res.data.data = orderedUsers;
//         return res.data;
//     }

//     public static async getFollowedStreams(): Promise<TwitchFollowedStream[]> {
//         const url = new URL('https://api.twitch.tv/helix/streams/followed');
//         const userId = authStore.session.user.user_metadata.provider_id;
//         url.searchParams.append('user_id', userId);
//         const res = await TwitchApiService.http.get<TwitchGetFollowedStreams>(url.toString());
//         return res.data.data;
//     }

//     public async getFollowedStreamsWithUser(): Promise<TwitchFollowedStreamWithUser[]> {
//         const followedStreams = await this.getFollowedStreams();
//         const userIds = followedStreams.map((stream) => Number(stream.user_id));
//         const users = (await this.getUsers({ ids: userIds })).data;
//         const streamsWithUser = followedStreams.map<TwitchFollowedStreamWithUser>((stream, index) => {
//             return {
//                 ...followedStreams[index],
//                 ...users[index],
//             };
//         });
//         return streamsWithUser;
//     }

//     public async getFollowedChannels(userId: number, broadcasterId?: number): Promise<TwitchGetFollowedChannels> {
//         const url = new URL('https://api.twitch.tv/helix/channels/followed');
//         url.searchParams.append('user_id', userId.toString());
//         if (broadcasterId) url.searchParams.append('broadcaster_id', broadcasterId.toString());

//         const res = await this.http.get<TwitchGetFollowedChannels>(url.toString());
//         return res.data;
//     }

//     public async getVideosByUserId(
//         userId: number,
//         type: VideoTypesModel = 'all',
//         after?: string, // cursor
//         amount: number = 20
//         // options?: TwitchGetVideosOptions,
//     ): Promise<TwitchGetVideos> {
//         const url = new URL('https://api.twitch.tv/helix/videos');
//         url.searchParams.append('user_id', userId.toString());
//         url.searchParams.append('type', type);
//         url.searchParams.append('first', amount.toString());
//         if (after) url.searchParams.append('after', after);

//         const res = await this.http.get<TwitchGetVideos>(url.toString());
//         return res.data;
//     }

//     public async getVideosByVideoIds(ids: number[]): Promise<TwitchGetVideos | { data: never[] }> {
//         const url = new URL('https://api.twitch.tv/helix/videos');
//         if (ids.length > 100) ids = ids.slice(0, 100);
//         if (ids.length === 0) return { data: [] };

//         ids.forEach((id) => url.searchParams.append('id', id.toString()));
//         const res = await this.http.get<TwitchGetVideos>(url.toString());
//         const unorderedVideos = res.data.data;

//         const orderedVideos: TwitchVideo[] = ids.reduce((acc: TwitchVideo[], id: number) => {
//             const video = unorderedVideos.find((unorderedVideo) => Number(unorderedVideo.id) === id);
//             if (video) acc.push(video);
//             return acc;
//         }, []);

//         res.data.data = orderedVideos;
//         return res.data;
//     }

//     public async getChannelFollowers(broadcasterId: number): Promise<TwitchGetChannelFollowers> {
//         const url = new URL('https://api.twitch.tv/helix/channels/followers');
//         url.searchParams.append('broadcaster_id', broadcasterId.toString());

//         const res = await this.http.get<TwitchGetChannelFollowers>(url.toString());
//         return res.data;
//     }

//     public async getGames(game: { ids?: number[]; names?: string[] }): Promise<TwitchGetGames> {
//         const url = new URL('https://api.twitch.tv/helix/games');
//         if (game.ids) game.ids.forEach((id) => url.searchParams.append('id', id.toString()));
//         if (game.names) game.names.forEach((name) => url.searchParams.append('name', name));

//         const res = await this.http.get<TwitchGetGames>(url.toString());

//         let orderedGames: TwitchGame[] = [];

//         // the ordering of the games could look prettier
//         if (game.ids) {
//             orderedGames = game.ids
//                 .map((gameId) => res.data.data.find((game) => Number(game.id) === gameId))
//                 .filter(Boolean) as TwitchGame[];
//         }

//         if (game.names) {
//             orderedGames = game.names
//                 .map((gameName) => res.data.data.find((game) => game.name.toLowerCase() === gameName.toLowerCase()))
//                 .filter(Boolean) as TwitchGame[];
//         }

//         res.data.data = orderedGames;
//         return res.data;
//     }

//     public async getStreamsByGameIds(ids: number[]): Promise<TwitchGetStreams> {
//         const url = new URL('https://api.twitch.tv/helix/streams');
//         ids.forEach((id) => url.searchParams.append('game_id', id.toString()));
//         url.searchParams.append('first', '100');

//         const res = await this.http.get<TwitchGetStreams>(url.toString());
//         return res.data;
//     }

//     public async getStreamsByGameIdWithUsers(id: number): Promise<TwitchStreamsWithUser[]> {
//         const streams = (await this.getStreamsByGameIds([id])).data;
//         const userIds = streams.map((stream) => Number(stream.user_id));
//         const users = (await this.getUsers({ ids: userIds })).data;
//         const streamsWithUser = streams.map<TwitchStreamsWithUser>((stream, index) => {
//             return {
//                 ...streams[index],
//                 ...users[index],
//             };
//         });
//         return streamsWithUser;
//     }

//     public async getSchedules(userIds: number[], amount = 25): Promise<TwitchSchedule[]> {
//         const promises = userIds.map(async (userId) => {
//             const url = new URL('https://api.twitch.tv/helix/schedule');
//             url.searchParams.append('broadcaster_id', userId.toString());
//             url.searchParams.append('first', amount.toString());
//             return await this.http.get<TwitchGetSchedule>(url.toString()).catch(() => null);
//         });

//         return (await Promise.all(promises)).filter(Boolean).map((res) => res!.data.data);
//     }

//     public async getScheduleWithUsers(userIds: number[]): Promise<TwitchScheduleWithUser[]> {
//         const schedules = await this.getSchedules(userIds);
//         const userIdsWithSchedules = schedules.map((schedule) => Number(schedule.broadcaster_id));
//         const usersWithSchedules = (await this.getUsers({ ids: userIdsWithSchedules })).data;

//         return usersWithSchedules.map((user) => {
//             const schedule = schedules.find((schedule) => Number(schedule.broadcaster_id) === Number(user.id))!;

//             return { schedule, user };
//         });
//     }

//     public async checkUserSubscription(userId: number, broadcasterId: number): Promise<boolean> {
//         const url = new URL('https://api.twitch.tv/helix/subscriptions/user');
//         url.searchParams.append('user_id', userId.toString());
//         url.searchParams.append('broadcaster_id', broadcasterId.toString());

//         return this.http
//             .get<TwitchCheckUserSubscription>(url.toString())
//             .then(() => true)
//             .catch(() => false);
//     }

//     // static methods
//     public static async validateToken(accessToken: string) {
//         const res = await axios.get('https://id.twitch.tv/oauth2/validate', {
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         return {
//             userId: Number(res.data.user_id),
//             userLogin: res.data.login as string,
//         };
//     }

//     public static getSignInURL() {
//         const url = new URL('https://id.twitch.tv/oauth2/authorize');
//         url.searchParams.append('client_id', 'bpjttmchlxdfo9t47z8g3b7snhr9h4');
//         url.searchParams.append('redirect_uri', `${window.location.origin}/auth/sign-in`);
//         url.searchParams.append('force_verify', 'false');
//         url.searchParams.append('response_type', 'token');
//         url.searchParams.append('scope', 'user:read:follows user:read:subscriptions moderator:read:followers');

//         return url.href;
//     }
// }
