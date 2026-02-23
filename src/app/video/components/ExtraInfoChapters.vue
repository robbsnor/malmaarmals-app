<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import CategoryThumbnail from './CategoryThumbnail.vue';
import Chapters from './Chapters.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <ExtraInfoItem v-if="videoStore.chapters.length" title="Chapters">
        <div v-if="videoStore.chapters?.length" class="flex flex-col gap-2 p-4">
            <Chapters />
        </div>

        <Empty v-else title="No chapters yet..." icon="mdi-format-list-bulleted"> </Empty>
    </ExtraInfoItem>
</template>
