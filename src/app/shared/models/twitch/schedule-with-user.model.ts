import type { TwitchSchedule } from "./schedule.model";
import type { TwitchUser } from "./users.model";

export interface TwitchScheduleWithUser {
    schedule: TwitchSchedule,
    user: TwitchUser,
}
