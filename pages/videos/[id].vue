<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()

const videoId = route.params.id
const videoInfo = ref()
const videoUrl = ref()
const messages = ref<any>()

const getVideoInfo = async () => {
    const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('id', videoId)
        .single()

    if (videoError) return console.error('Error fetching videos:', videoError)

    videoInfo.value = videoData
}
const getVideoUrl = async () => {
    const res = supabase.storage
        .from('videos')
        .getPublicUrl(`${videoId}_video.mp4`)

    videoUrl.value = res.data.publicUrl
}
const getMessages = async () => {
    const messagesResult = await supabase
        .from('messages')
        .select('*')
        .eq('video_id', videoId)

    if (messagesResult.error) {
        return console.error(
            'Error fetching video category mapping:',
            messagesResult.error,
        )
    }

    messages.value = messagesResult.data
}

const date = computed(() => {
    return new Date(videoInfo.value.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
})

onMounted(async () => {
    getVideoInfo()
    getVideoUrl()
    getMessages()

    // const { data: categorymappin, error: videoError } = await supabase
    //     .from('video_category_mapping')
    //     .select('category_id(*), video_id(*)')
    //     // .select('*')
    //     .eq('video_id', data.id)

    // console.log('categorymappin', categorymappin)
})
</script>

<template>
    <div
        class="grid-flow-colf 4xl:grid-cols-[1fr_600px] grid h-screen gap-4 p-4 xl:grid-cols-[1fr_360px]"
    >
        <div v-if="videoInfo">
            <div class="relative flex-1">
                <UButton
                    icon="i-lucide-chevron-left"
                    color="primary"
                    to="/videos"
                    class="absolute top-4 left-4 z-10"
                >
                    Back to videos
                </UButton>
                <video
                    v-if="videoUrl"
                    controls
                    :src="videoUrl"
                    class="aspect-video h-full w-full rounded-md"
                ></video>
            </div>
            <div class="p-4">
                <h2 class="text-xl font-bold">{{ videoInfo.title }}</h2>
                <h3>{{ videoInfo.description }}</h3>
                <h3>{{ date }}</h3>
            </div>
        </div>

        <div v-if="messages" class="overflow-y-auto rounded-md">
            <ul class="flex flex-col gap-[2px]">
                <li v-for="message in messages" :key="message.id">
                    <span
                        :style="{
                            color: message.user_color
                                ? message.user_color
                                : '#691bb1',
                        }"
                        class="font-bold"
                    >
                        {{ message.user_name }}
                    </span>
                    <span class="break-words text-gray-300">
                        : {{ message.text }}
                    </span>
                </li>
            </ul>
        </div>
    </div>
</template>
