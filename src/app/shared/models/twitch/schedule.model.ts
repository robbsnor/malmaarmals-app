import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference/#get-channel-stream-schedule
export interface TwitchGetSchedule {
    data: TwitchSchedule;
    pagination: TwitchPagination;
}

export interface TwitchSchedule {
    segments: TwitchScheduleSegment[] | null;
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    vacation: any;
}

export interface TwitchScheduleSegment {
    id: string;
    start_time: string;
    end_time: string;
    title: string;
    canceled_until: any | null;
    category: TwitchScheduleCategory | null;
    is_recurring: boolean;
}

export interface TwitchScheduleCategory {
    id: number;
    name: string;
}
