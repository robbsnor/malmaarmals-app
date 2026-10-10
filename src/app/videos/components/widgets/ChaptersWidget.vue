<script setup lang="ts">
import { useVideoStore } from '../../stores/video.store.ts';
import Widget from './Widget.vue';
import Chapter from '../Chapter.vue';
import { usePreferenceStore } from '../../../shared/stores/preference.store.ts';

const videoStore = useVideoStore();
const preferenceStore = usePreferenceStore();
</script>

<template>
    <Widget v-if="videoStore.chapters.length" title="Chapters">
        <template v-if="preferenceStore.showChapters">
            <div v-if="videoStore.chapters?.length" class="pt-4">
                <Chapter v-for="chapter in videoStore.chapters" :key="chapter.id" :chapter="chapter" />
            </div>

            <Empty v-else title="No chapters yet..." icon="mdi-format-list-bulleted"> </Empty>
        </template>

        <Empty v-else icon="mdi-eye-off-outline" description="Chapters have been hidden in settings.">
            <v-btn @click="preferenceStore.drawer = true" variant="text" color="primary">settings</v-btn>
        </Empty>
    </Widget>
</template>
