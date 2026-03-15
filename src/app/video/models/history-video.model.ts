import type { Tables } from '../../shared/models/database.types';
import type { VideoWithChapters } from './videos-with-chapters.model';

export interface HistoryWithVideo extends Tables<'history'> {
    video: VideoWithChapters;
}
