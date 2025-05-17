<script setup lang="ts">
const router = useRouter()
function goToVideos() {
    router.push('/videos')
}
</script>

<template>
    <div
        class="flex flex-col items-center justify-center"
        style="height: 100vh"
    >
        <div
            class="flex w-full max-w-md flex-col items-center gap-4 rounded-xl bg-white/80 p-8 shadow-xl"
        >
            <h1 class="mb-2 text-3xl font-bold text-blue-700">
                Welcome to Malmaarmals!
            </h1>
            <p class="mb-6 text-center text-gray-600">
                Discover our curated collection of videos.
            </p>
            <UButton @click="goToVideos"> Go to Videos </UButton>
        </div>
    </div>
</template>
