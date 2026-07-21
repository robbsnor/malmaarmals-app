export class TwitchHelper {
    static getCategoryThumbnail(id: string) {
        const newIds = ['509658', '491180', '509577', '509663', '495926', '495926', '497451', '743'];

        if (newIds.includes(id)) {
            return `https://static-cdn.jtvnw.net/ttv-boxart/${id}-285x380.jpg`;
        }

        return `https://static-cdn.jtvnw.net/ttv-boxart/${id}_IGDB-285x380.jpg`;
    }

    static getBadgeUrl(imageId: string) {
        return `https://static-cdn.jtvnw.net/badges/v1/${imageId}/2`;
    }
}
