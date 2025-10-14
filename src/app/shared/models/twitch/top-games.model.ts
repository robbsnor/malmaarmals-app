import type { TwitchPagination } from "./pagination.model";

// https://dev.twitch.tv/docs/api/reference#get-top-games
export interface TwitchGetTopGames {
    data: TwitchTopGames[];
    pagination: TwitchPagination;
}

export interface TwitchTopGames {
    id: number;
    name: string;
    box_art_url: string;
}

export interface TwitchGetTopGamesOptions {
    first?: number;
    before?: number;
    after?: number;
}
