<script setup lang="ts">
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { computed, onMounted, ref } from 'vue';
import { merge } from 'lodash';

const player = ref<Plyr>();

const props = withDefaults(
    defineProps<{
        src: string;
        options?: any;
    }>(),
    {}
);

const opt = computed(() => {
    const defaultOptions = {
        controls: [
            'play-large',
            'play',
            'progress',
            'current-time',
            'duration',
            'mute',
            'volume',
            'settings',
            'pip',
            'airplay',
            'fullscreen',
        ],
        disableContextMenu: false,
        volume: 0.75,
        autoplay: true,
    };

    return merge(defaultOptions, props.options);
});

onMounted(() => {
    player.value = new Plyr('video', opt.value);
});
</script>

<template>
    <video
        id="video"
        controls
        style="max-height: calc(100vh - var(--header-height) - (var(--spacing) * 4 * 2))"
        ref="videoRef"
        class="aspect-video w-full rounded-md"
        playsinline
    >
        <source :src="props.src" type="video/mp4" />
    </video>
</template>
