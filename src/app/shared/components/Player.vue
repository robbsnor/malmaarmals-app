<script setup lang="ts">
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { computed, onMounted, ref, useAttrs, defineExpose, useTemplateRef, watch } from 'vue';
import { merge } from 'lodash';
import { playerDefaultOptions } from '../data/player.data';

const props = withDefaults(
    defineProps<{
        options?: any;
    }>(),
    {}
);

const attrs = useAttrs();

const player = ref<Plyr>();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

const opt = computed(() => merge(playerDefaultOptions, props.options));

onMounted(() => {
    player.value = new Plyr(videoRef.value, opt.value);
});

defineExpose({ videoRef, player });
</script>

<template>
    <video v-bind="attrs" id="video" controls class="aspect-video w-full" playsinline ref="videoRef">
        <slot></slot>
    </video>
</template>
