import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference/#get-followed-channels
export interface TwitchGetFollowedChannels {
    total: number;
    data: TwitchFollowedChannnel[];
    pagination: TwitchPagination;
}

export interface TwitchFollowedChannnel {
    broadcaster_id: string;
    broadcaster_login: string;
    broadcaster_name: string;
    followed_at: string;
}
