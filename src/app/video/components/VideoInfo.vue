<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
</script>

<template>
    <div class="bg-red-300 p-4 flex justify-between gap-4">
        <div>
            <div>title</div>
            <!-- <div>description</div> -->
            <div>data</div>
        </div>

        <div class="md:hidden! transition-all" :class="{ 'rotate-180': videoStore.showExtraInfoMobile }">
            <v-btn
                variant="text"
                @click="videoStore.showExtraInfoMobile = !videoStore.showExtraInfoMobile"
                icon="mdi-chevron-down"
            ></v-btn>
        </div>
    </div>
</template>
