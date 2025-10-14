import type { TwitchMutedSegment } from "./muted-segment.model";
import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference#get-videos
export interface TwitchGetVideos {
    data: TwitchVideo[];
    pagination: TwitchPagination;
}

export interface TwitchVideo {
    id: string;
    stream_id?: any;
    user_id: string;
    user_login: string;
    user_name: string;
    title: string;
    description: string;
    created_at: string;
    published_at: string;
    url: string;
    thumbnail_url: string;
    viewable: string;
    view_count: number;
    language: string;
    type: string;
    duration: string;
    muted_segments: TwitchMutedSegment[];
}

export interface TwitchGetVideosOptions {
    first?: number;
    type?: 'all' | 'upload' | 'archive' | 'highlight';
}
