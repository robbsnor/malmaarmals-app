import type { Tables } from '../../shared/models/database.types';
import type { Video } from '../../video/models/videos-with-chapters.model';

export interface HistoryVideo extends Video {
    history: Tables<'history'>;
}
