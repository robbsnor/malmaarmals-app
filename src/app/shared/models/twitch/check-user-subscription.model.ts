// https://dev.twitch.tv/docs/api/reference/#check-user-subscription
export interface TwitchCheckUserSubscription {
    data: TwitchUserSubscription[];
}

export interface TwitchUserSubscription {
    broadcaster_id: string;
    broadcaster_name: string;
    broadcaster_login: string;
    is_gift: boolean;
    tier: string;
}
