<script setup lang="ts">
import { useVideoStore } from '../../stores/video.store.ts';
import Widget from './Widget.vue';
import Chapter from '../Chapter.vue';

const videoStore = useVideoStore();
</script>

<template>
    <Widget v-if="videoStore.chapters.length" title="Chapters">
        <div v-if="videoStore.chapters?.length" class="pt-4">
            <Chapter v-for="chapter in videoStore.chapters" :key="chapter.id" :chapter="chapter" />
        </div>

        <Empty v-else title="No chapters yet..." icon="mdi-format-list-bulleted"> </Empty>
    </Widget>
</template>
