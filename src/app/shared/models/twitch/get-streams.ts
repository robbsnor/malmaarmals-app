import type { TwitchPagination } from "./pagination.model";

export interface TwitchGetStreams {
    data: TwitchStreams[];
    pagination: TwitchPagination;
}

// https://dev.twitch.tv/docs/api/reference/#get-streams
export interface TwitchStreams {
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
    tag_ids: any[];
    tags: string[];
    is_mature: boolean;
}
