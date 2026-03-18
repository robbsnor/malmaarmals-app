<script setup lang="ts">
import { computed } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const { copy, copied, isSupported } = useClipboard();

const date = computed(() => {
    return new Date(videoStore.info.recorded_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
});

function copyTitle() {
    if (!isSupported.value || !videoStore.info?.title) return;
    copy(videoStore.info.title);
}
</script>

<template>
    <div
        class="bg-black-100/80 backdrop-blur-[100px] border-black-400 flex min-h-[84px] justify-between gap-4 border-b p-4 lg:px-8"
    >
        <template v-if="videoStore.info">
            <div>
                <div class="text-lg font-bold">
                    {{ videoStore.info.title }}
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
