<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { supabase } from '../../../supabase';
import ManageChaptersRow from './ManageChaptersRow.vue';
import { useVideoStore } from '../stores/video.store';
import { sleep } from '../../shared/helpers/sleep';
import ChapterControlls from './ChapterControlls.vue';
import { v4 } from 'uuid';
import ManageChaptersInstructionsDialog from './ManageChaptersInstructionsDialog.vue';

const emits = defineEmits<{
    (e: 'add-chapter'): void;
}>();
const videoStore = useVideoStore();
const valid = ref(false);
const loading = ref(false);
const resetLoading = ref(false);

async function addEmptyChapter() {
    const emptyChapter = {
        id: v4(),
        category_id: '',
        end_s: 0,
        start_s: videoStore.currentTimeRounded,
        video_id: videoStore.videoId,
        category: {
            id: v4(),
            category_id: '',
            image_url: '',
            title: '',
        },
    };
    videoStore.chapters.push(emptyChapter);
}
</script>

<template>
    <div v-if="videoStore.editMode">
        <template v-if="videoStore.chapters.length">
            <div>
                <v-form v-model="valid" v-auto-animate class="flex flex-col gap-4">
                    <ManageChaptersRow
                        v-for="(chapter, i) in videoStore.chapters"
                        :key="chapter.id"
                        v-model="videoStore.chapters[i]"
                        :i="i"
                    />
                </v-form>
            </div>

            <div class="mt-6">
                <v-btn @click="addEmptyChapter" variant="tonal" class="w-full" color="primary">Add Chapter</v-btn>
            </div>
        </template>

        <Empty
            v-else
            title="No chapters..."
            description="Add your first chapter to get started!"
            icon="mdi-format-list-bulleted"
        >
            <div class="flex flex-col gap-4">
                <v-btn @click="addEmptyChapter" color="primary" prepend-icon="mdi-plus">Add chapters</v-btn>
            </div>
        </Empty>
    </div>
</template>
