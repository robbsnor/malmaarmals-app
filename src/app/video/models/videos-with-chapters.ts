import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const videosWithChaptersQuery = supabase
    .from('videos')
    .select('*, chapters(*, category:categories(*))')
    .order('recorded_at', { ascending: false });

export type VideosWithChapters = QueryData<typeof videosWithChaptersQuery>;
export type VideoWithChapters = VideosWithChapters[number];
