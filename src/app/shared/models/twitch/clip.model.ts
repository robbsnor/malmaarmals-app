import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference#get-clips
export interface TwitchGetClips {
    data: TwitchClip[];
    pagination: TwitchPagination;
}

export interface TwitchClip {
    id: string;
    url: string;
    embed_url: string;
    broadcaster_id: string;
    broadcaster_name: string;
    creator_id: string;
    creator_name: string;
    video_id: string;
    game_id: string;
    language: string;
    title: string;
    view_count: number;
    created_at: Date;
    thumbnail_url: string;
    duration: number;
}
