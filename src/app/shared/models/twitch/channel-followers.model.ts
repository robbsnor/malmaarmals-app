import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference/#get-channel-followers
export interface TwitchGetChannelFollowers {
    total: number;
    data: any[];
    pagination: TwitchPagination;
}
