<script setup lang="ts">
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { computed, onMounted, ref, useAttrs, useTemplateRef, watch } from 'vue';
import { merge } from 'lodash';
import { playerDefaultOptions } from '../data/player.data';

const props = withDefaults(
    defineProps<{
        options?: any;
        stretchHeight?: boolean;
    }>(),
    {
        stretchHeight: false,
    }
);

const attrs = useAttrs();
const videoRef = useTemplateRef<HTMLVideoElement>('videoRef');

const player = ref<Plyr>();

const options = computed(() => merge(playerDefaultOptions, props.options));

onMounted(() => {
    player.value = new Plyr(videoRef.value, options.value);
});

defineExpose({ videoRef, player });
</script>

<template>
    <div class="piss player" :class="{ 'player--stretch-height': stretchHeight }">
        <video v-bind="attrs" controls playsinline ref="videoRef">
            <slot></slot>
        </video>
    </div>
</template>

<style lang="scss">
.plyr {
    width: 100%;
    height: 100%;
}

.player {
    .plyr {
        width: 100%;
        height: 100%;
    }

    &--stretch-height {
        height: 100%;

        .plyr {
            height: 100%;
        }
    }
}
</style>
