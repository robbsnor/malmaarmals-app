import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const videosQuery = supabase
    .from('videos')
    .select('*, chapters(*, category:categories(*))')
    .order('recorded_at', { ascending: false });

type Videos = QueryData<typeof videosQuery>;
export type Video = Videos[number];
