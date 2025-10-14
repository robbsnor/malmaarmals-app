import type { TwitchFollowedStream } from "./followed-streams.model";
import type { TwitchUser } from "./users.model";

export interface TwitchFollowedStreamWithUser extends TwitchFollowedStream, TwitchUser { }
