export class BucketHelper {
    static BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

    static getThumbnailUrl(id: number) {
        return `${BucketHelper.BUCKET_URL}/thumbnails/${id}`;
    }

    static getVideoUrl(id: number) {
        return `${BucketHelper.BUCKET_URL}/videos/${id}`;
    }
}
