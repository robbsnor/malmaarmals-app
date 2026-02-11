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
