<script setup lang="ts">
const router = useRouter()
const supabase = useSupabaseClient()

const { data: videos, error } = await supabase
    .from('videos')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(10)
</script>

<template>
    <div class="container">
        <Container>
            <GridSection>
                <NuxtLink
                    v-for="video in videos"
                    :key="video.video_id"
                    :to="`/videos/${video.video_id}`"
                >
                    <img
                        :src="`http://localhost:8000/thumbnails/${video.video_id}`"
                        alt=""
                    />
                    <h2>{{ video.title }}</h2>
                    <p v-if="video.description">{{ video.description }}</p>
                    <p>
                        {{ new Date(video.recorded_at).toLocaleString() }}
                    </p>
                </NuxtLink>
            </GridSection>
        </Container>
    </div>
</template>
