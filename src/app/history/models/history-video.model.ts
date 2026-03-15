import type { Tables } from '../../shared/models/database.types';
import type { VideoWithChapters } from '../../video/models/videos-with-chapters.model';

export interface HistoryVideo extends VideoWithChapters {
    history: Tables<'history'>;
}
