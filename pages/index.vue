<script setup lang="ts">
const router = useRouter()
const supabase = useSupabaseClient()
const videos = ref<any[]>([])
const videosError = ref<string>()

onMounted(async () => {
    await fetchVideos()
})

const fetchVideos = async () => {
    const { data, error } = await supabase
        .from('videos')
        .select('*, categories: video_category_mapping(...categories(*))')
        .order('recorded_at', { ascending: false })
        .limit(4)

    if (error) {
        console.error('Error fetching videos:', error)
        videosError.value = error.message
    }
    videos.value = data
}
</script>

<template>
    <VideoSection title="Latest Videos">
        <div class="grid grid-cols-15 items-center gap-8">
            <Video
                v-for="(video, idx) in videos"
                :key="video.video_id"
                :video="video"
                :class="idx < 1 ? 'col-span-6' : 'col-span-3'"
                :is-first="idx < 1"
            />
        </div>
    </VideoSection>
</template>
