<script setup lang="ts">
const props = defineProps<{
    videos: any[]
}>()
</script>

<template>
    <NuxtLink
        v-for="video in props.videos"
        :key="video.video_id"
        :to="`/videos/${video.video_id}`"
    >
        <img
            :src="`http://localhost:8000/thumbnails/${video.video_id}`"
            alt=""
            class="mb-2 rounded-md"
        />
        <h2 class="text-md font-bold">{{ video.title }}</h2>
        <p v-if="video.description" class="text-black-700 text-sm">
            {{ video.description }}
        </p>
        <p class="text-sm text-gray-500">
            {{ new Date(video.recorded_at).toLocaleString() }}
        </p>

        <template v-if="video.categories.length">
            <div
                v-for="category in video.categories"
                :key="category.id"
                class="mt-2 flex items-center gap-2"
            >
                <img :src="category.image_url" alt="" class="rounded-md" />

                <span class="text-sm text-gray-500">
                    {{ category.title }}
                </span>
            </div>
        </template>
    </NuxtLink>
</template>
