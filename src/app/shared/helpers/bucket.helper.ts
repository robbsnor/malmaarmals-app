import { useAuthStore } from '../../auth/stores/auth.store';

export class BucketHelper {
    static BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

    static getThumbnailUrl(id: number) {
        return `${BucketHelper.BUCKET_URL}/thumbnails/${id}`;
    }

    static async getVideoUrl(videoId: number): Promise<{ signedUrl: string }> {
        const authStore = useAuthStore();
        const twitchUserId = authStore.session?.user?.user_metadata?.provider_id;
        if (!twitchUserId) throw new Error('User not authenticated');

        const data = await fetch(`${BucketHelper.BUCKET_URL}/generate-video-url`, {
            method: 'POST',
            body: JSON.stringify({ videoId: videoId, twitchUserId }),
        });
        return await data.json();
    }
}
