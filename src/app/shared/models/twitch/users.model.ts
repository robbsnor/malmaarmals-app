// https://dev.twitch.tv/docs/api/reference#get-users
export interface TwitchGetUsers {
    data: TwitchUser[];
}

export interface TwitchUser {
    id: string;
    login: string;
    display_name: string;
    type: string;
    broadcaster_type: string;
    description: string;
    profile_image_url: string;
    offline_image_url?: string;
    created_at: string;
}
