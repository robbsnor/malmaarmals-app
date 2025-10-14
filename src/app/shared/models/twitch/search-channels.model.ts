import type { TwitchPagination } from "./pagination.model";

export interface TwitchSearchChannels {
    data: TwitchSearchChannel[];
    pagination: TwitchPagination;
}

export interface TwitchSearchChannel {
    broadcaster_language: string;
    broadcaster_login: string;
    display_name: string;
    game_id: string;
    game_name: string;
    id: string;
    is_live: boolean;
    tag_ids: any[];
    tags: any[];
    thumbnail_url: string;
    title: string;
    started_at: string;
}
