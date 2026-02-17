import { useAuthStore } from '../../auth/stores/auth.store';
import type { GetVideoUrl } from '../models/bucket.models';

export class BucketHelper {
    static BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    static getThumbnailUrl(id: number) {
        return `${BucketHelper.BACKEND_URL}thumbnails/${id}`;
    }

    static async getVideoUrl(videoId: number): Promise<GetVideoUrl> {
        const authStore = useAuthStore();
        const twitchUserId = authStore.session?.user?.user_metadata?.provider_id;
        if (!twitchUserId || !authStore.session?.access_token || !authStore.twitchAccessToken) {
            throw new Error('User not authenticated');
        }

        const res = await fetch(`${BucketHelper.BACKEND_URL}/generate-video-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authStore.session.access_token}`,
                'X-Twitch-Access-Token': authStore.twitchAccessToken,
            },
            body: JSON.stringify({ videoId: videoId, twitchUserId }),
        });

        return res.json();
    }
}
