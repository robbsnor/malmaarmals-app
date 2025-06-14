<script setup lang="ts">
const route = useRoute()
const supabase = useSupabaseClient()

const videoId = route.params.id
const videoInfo = ref()
const messages = ref<any[]>([])
const videoRef = ref(null)
const currentTime = ref(0)

const messageList = computed(() => {
    // Find messages at current time and previous 500 messages (by offset_sec)
    const current = currentTime.value
    // Filter messages with offset_sec <= current time, sort by offset_sec descending, take last 500, then sort ascending
    const filtered = messages.value
        .filter((msg) => msg.offset_sec <= current)
        .sort((a, b) => b.offset_sec - a.offset_sec)
        .slice(0, 20)
        .sort((a, b) => a.offset_sec - b.offset_sec)
    return filtered
})

const getVideoInfo = async () => {
    const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .eq('video_id', videoId)
        .single()

    if (videoError) return console.error('Error fetching videos:', videoError)

    videoInfo.value = videoData
}
const getMessages = async () => {
    const messagesResult = await supabase
        .from('messages')
        .select('*')
        .eq('video_id', videoId)
        .order('date', { ascending: true })

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

const updateCurrentTime = () => {
    if (!videoRef.value) return
    currentTime.value = Math.floor(videoRef.value.currentTime)
}

onMounted(async () => {
    getVideoInfo()
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
                <video
                    ref="videoRef"
                    controls
                    :src="`http://localhost:8000/videos/${videoInfo.video_id}`"
                    class="aspect-video h-full w-full rounded-md"
                    @timeupdate="updateCurrentTime()"
                ></video>
            </div>
            <div class="p-4">
                <h2 class="text-xl font-bold">{{ videoInfo.title }}</h2>
                {{ currentTime }}s
                <h3>{{ videoInfo.description }}</h3>
                <h3>{{ date }}</h3>
                {{ messages ? messages.length : 0 }}
            </div>
        </div>

        <div v-if="messages" class="overflow-y-auto rounded-md">
            <ul v-auto-animate class="flex flex-col gap-[2px]">
                <li v-for="message in messageList" :key="message.id">
                    <span
                        :style="{
                            color: message.user_color
                                ? message.user_color
                                : '#2e8b57',
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
