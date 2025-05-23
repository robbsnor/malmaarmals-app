<script setup lang="ts">
const router = useRouter()
function goToVideos() {
    router.push('/videos')
}
</script>

<template>
    <div class="container">
        <h1>Video</h1>
        <button @click="goToVideos">Go to Videos</button>
    </div>
</template>
