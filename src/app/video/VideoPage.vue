<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAppStore } from '../shared/stores/app.store';
import { useVideoStore } from './stores/video.store';

const route = useRoute();
const appStore = useAppStore();
const videoStore = useVideoStore();

onMounted(async () => {
    videoStore.videoId = route.params.id as string;
    appStore.player.isActive = true;
    appStore.player.isMini = false;

    await videoStore.fetchVideoInfo();
    await videoStore.fetchMessages();
});

onUnmounted(() => {
    appStore.player.isMini = true;
});
</script>
