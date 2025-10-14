import type { TwitchPagination } from "./pagination.model";
import type { TwitchUser } from "./users.model";

// https://dev.twitch.tv/docs/api/reference#get-followed-streams
export interface TwitchGetFollowedStreams {
    data: TwitchFollowedStream[];
    pagination: TwitchPagination;
}

export interface TwitchFollowedStream {
    id: string;
    user_id: string;
    user_login: string;
    user_name: string;
    game_id: string;
    game_name: string;
    type: string;
    title: string;
    viewer_count: number;
    started_at: Date;
    language: string;
    thumbnail_url: string;
    tag_ids: string[];
    tags: string[];
}
