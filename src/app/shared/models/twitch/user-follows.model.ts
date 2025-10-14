import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference/#get-users-follows
export interface TwitchGetUsersFollows {
    data: TwitchUsersFollows[];
    pagination: TwitchPagination;
}

export interface TwitchUsersFollows {
    from_id: string;
    from_login: string;
    from_name: string;
    to_id: string;
    to_name: string;
    followed_at: Date;
}
