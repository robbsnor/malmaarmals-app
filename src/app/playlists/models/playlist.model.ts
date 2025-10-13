import type { QueryData } from '@supabase/supabase-js';
import { supabase } from '../../../supabase';

export const playlistsQuery = supabase
    .from('playlists')
    .select(`*, playlist_videos(...videos(*))`)
    .order('position', { ascending: true });

export type Playlists = QueryData<typeof playlistsQuery>;
export type Playlist = Playlists[number];
