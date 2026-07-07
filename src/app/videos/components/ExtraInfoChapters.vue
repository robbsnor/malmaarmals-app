<script setup lang="ts">
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import Chapter from './Chapter.vue';

const videoStore = useVideoStore();
</script>

<template>
    <ExtraInfoItem v-if="videoStore.chapters.length" title="Chapters">
        <div v-if="videoStore.chapters?.length" class="p-4">
            <Chapter v-for="chapter in videoStore.chapters" :key="chapter.id" :chapter="chapter" />
        </div>

        <Empty v-else title="No chapters yet..." icon="mdi-format-list-bulleted"> </Empty>
    </ExtraInfoItem>
</template>
