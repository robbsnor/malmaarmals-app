<script setup lang="ts">
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useVideoStore } from '../stores/video.store';
import { useAppStore } from '../../shared/stores/app.store';

const videoStore = useVideoStore();
const appStore = useAppStore();
const { copy, copied, isSupported } = useClipboard();

const date = computed(() => {
    return new Date(videoStore.video.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

function copyTitle() {
    if (!isSupported.value || !videoStore.video?.title) return;
    copy(videoStore.video.title);
}
</script>

<template>
    <div
        class="bg-black-100/80 backdrop-blur-[100px] border-black-400 flex min-h-[84px] justify-between gap-4 border-b p-4"
        :class="{ 'px-8': appStore.isLandscape }"
    >
        <template v-if="videoStore.video">
            <div>
                <div class="text-lg font-bold">
                    {{ videoStore.video.title }}
                    <!-- <div v-auth class="inline-block">
                        <v-btn
                            :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
                            variant="text"
                            size="small"
                            :title="copied ? 'Copied' : 'Copy title'"
                            :disabled="!isSupported"
                            @click="copyTitle"
                            color="grey"
                        />
                    </div> -->
                </div>

                <div class="text-muted">{{ date }}</div>
            </div>
            <!-- <div class="md:hidden! transition-all" :class="{ 'rotate-180': videoStore.showExtraInfoMobile }">
                <v-btn
                    variant="text"
                    @click="videoStore.showExtraInfoMobile = !videoStore.showExtraInfoMobile"
                    icon="mdi-chevron-down"
                ></v-btn>
            </div> -->
        </template>
    </div>
</template>
