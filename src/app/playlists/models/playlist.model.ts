import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const playlistsQuery = supabase
    .from('playlists')
    .select(`*, videos:playlist_videos(...videos(*, chapters(*, category:categories(*))))`)
    .order('order', { ascending: true });

export type Playlists = QueryData<typeof playlistsQuery>;
export type Playlist = Playlists[number];
