import { useAuthStore } from '../../auth/stores/auth.store';

export interface BucketReturn<T> {
    data: T | null;
    error: {
        message: string;
        code: number;
    } | null;
}

export type GetVideoUrl = BucketReturn<{
    signedUrl: string;
}>;

export class BucketHelper {
    static BUCKET_URL = import.meta.env.VITE_BUCKET_URL;

    static getThumbnailUrl(id: number) {
        return `${BucketHelper.BUCKET_URL}/thumbnails/${id}`;
    }

    static async getVideoUrl(videoId: number): Promise<string | undefined> {
        const authStore = useAuthStore();
        const twitchUserId = authStore.session?.user?.user_metadata?.provider_id;
        if (!twitchUserId || !authStore.session?.access_token || !authStore.twitchAccessToken)
            throw new Error('User not authenticated');

        const res = await fetch(`${BucketHelper.BUCKET_URL}/generate-video-url`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Twitch-Access-Token': authStore.twitchAccessToken,
            },
            body: JSON.stringify({ videoId: videoId, twitchUserId }),
        });

        console.log('dataaaaa');

        const { data, error }: GetVideoUrl = await res.json();
        if (error) return;

        console.log(data.signedUrl);

        return data.signedUrl;
    }
}
