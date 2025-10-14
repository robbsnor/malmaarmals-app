// https://dev.twitch.tv/docs/api/reference/#get-games
export interface TwitchGetGames {
    data: TwitchGame[];
}

export interface TwitchGame {
    id: string;
    name: string;
    box_art_url: string;
    igdb_id: string;
}
