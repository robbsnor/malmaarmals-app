import type { TwitchStreams } from "./get-streams";
import type { TwitchUser } from "./users.model";

export interface TwitchStreamsWithUser extends TwitchStreams, TwitchUser { }
