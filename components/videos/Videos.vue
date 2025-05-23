<script setup lang="ts">
const props = defineProps<{
    videos: any[]
}>()
</script>

<template>
    <div class="flex-1 py-4">
        <div
            v-if="videos.length"
            class="grid gap-4 px-4"
            style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
        >
            <NuxtLink
                v-for="video in videos"
                :key="video.id"
                class="bg-brand-100 border-brand-300 hover:bg-brand-300 hover:border-brand-500 flex flex-col rounded-lg border p-4 transition-all"
                :to="`/videos/${video.id}`"
            >
                <h3 class="text-lg font-bold">{{ video.title }}</h3>
                <p v-if="video.description">{{ video.description }}</p>
            </NuxtLink>
        </div>

        <div
            v-else
            class="flex flex-col items-center justify-center py-16 text-center text-gray-500"
        >
            <h3 class="mb-2 text-lg font-semibold">No videos found</h3>
            <p class="mb-4">Try adjusting your filters.</p>
        </div>
    </div>
</template>
