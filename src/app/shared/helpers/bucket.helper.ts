import { useAuthStore } from '../../auth/stores/auth.store';

export class BucketHelper {
    static BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

    static getThumbnailUrl(id: number) {
        return `${BucketHelper.BUCKET_URL}/thumbnails/${id}`;
    }

    static async getVideoUrl(videoId: number): Promise<string | undefined> {
        const authStore = useAuthStore();
        const twitchUserId = authStore.session?.user?.user_metadata?.provider_id;
        if (!twitchUserId || !authStore.session?.access_token) throw new Error('User not authenticated');

        const data = await fetch(`${BucketHelper.BUCKET_URL}/generate-video-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.session?.access_token}`,
            },
            body: JSON.stringify({ videoId: videoId, twitchUserId }),
        });

        const { signedUrl } = await data.json();
        return signedUrl;
    }
}
