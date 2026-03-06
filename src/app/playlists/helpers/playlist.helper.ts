import type { Playlist, Playlists } from '../models/playlist.model';

export class PlaylistHelper {
    public static orderPlaylistsAndVideos(playlists: Playlists) {
        return playlists.map((playlist) => ({
            ...playlist,
            videos: this.sortVideosByOrderType(playlist),
        }));
    }

    private static sortVideosByOrderType(playlist: Playlist) {
        switch (playlist.order_type) {
            case 'date_ascending':
                return [...playlist.videos].sort(
                    (a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime()
                );

            case 'date_descending':
                return [...playlist.videos].sort(
                    (a, b) => new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
                );

            case 'custom':
                return playlist.videos; // TODO: implement custom sorting

            default:
                return playlist.videos;
        }
    }
}
