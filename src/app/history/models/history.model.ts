import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const historyQuery = supabase
    .from('history')
    .select('*, video:videos(*, chapters(*, category:categories(*)))')
    .order('watched_at', { ascending: false });

export type Histories = QueryData<typeof historyQuery>;
export type History = Histories[number];
