<script setup lang="ts">
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { computed, onMounted, ref, useAttrs, defineExpose, useTemplateRef } from 'vue';
import { merge } from 'lodash';

const props = withDefaults(
    defineProps<{
        options?: any;
    }>(),
    {}
);

const attrs = useAttrs();

const player = ref<Plyr>();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

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
    if (videoRef.value) {
        player.value = new Plyr(videoRef.value, opt.value);
    }
});

defineExpose({ videoRef });
</script>

<template>
    <video v-bind="attrs" id="video" controls class="aspect-video w-full rounded-md" playsinline ref="videoRef">
        <slot></slot>
    </video>
</template>
