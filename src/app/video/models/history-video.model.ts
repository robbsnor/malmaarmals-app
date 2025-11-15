import type { VideoWithChapters } from './videos-with-chapters.model';

export interface HistoryVideo extends VideoWithChapters {
    watched_at: string;
}
