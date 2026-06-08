export class TwitchHelper {
    static getCategoryThumbnail(id: string) {
        if (id === '509658' || id === '491180' || id === '509577' || id === '509663') {
            return `https://static-cdn.jtvnw.net/ttv-boxart/${id}-285x380.jpg`;
        }

        return `https://static-cdn.jtvnw.net/ttv-boxart/${id}_IGDB-285x380.jpg`;
    }
}
