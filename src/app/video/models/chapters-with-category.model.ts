import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const chaptersWithCategoryQuery = supabase
    .from('chapters')
    .select('*, category:categories(*)')
    .order('start_s', { ascending: true });

export type ChaptersWithCategory = QueryData<typeof chaptersWithCategoryQuery>;
export type ChapterWithCategory = ChaptersWithCategory[number];
