<script setup lang="ts">
import { nextTick, ref } from 'vue';
import { supabase } from '../../../supabase';
import ManageChaptersRow from './ManageChaptersRow.vue';
import { useVideoStore } from '../stores/video.store';
import { sleep } from '../../shared/helpers/sleep';
import ChapterControlls from './ChapterControlls.vue';
import { v4 } from 'uuid';

const emits = defineEmits<{
    (e: 'add-chapter'): void;
}>();
const videoStore = useVideoStore();
const valid = ref(false);
const loading = ref(false);
const resetLoading = ref(false);
const showConfirmCancelDialog = ref(false);

async function saveCategories() {
    const categories = videoStore.chapters.map((chapter) => ({
        category_id: chapter.category.category_id,
        title: chapter.category.title,
        image_url: chapter.category.image_url,
    }));

    for (const category of categories) {
        const { error } = await supabase.from('categories').upsert(category, { onConflict: 'category_id' });
        if (error) throw error;
    }
}

async function deleteExistingChapters() {
    const { error } = await supabase.from('chapters').delete().eq('video_id', videoStore.videoId);
    if (error) throw error;
}

async function saveChapters() {
    videoStore.chapters.sort((a, b) => a.start_s - b.start_s);

    const chapters = videoStore.chapters.map((chapter, i) => ({
        video_id: videoStore.videoId,
        category_id: chapter.category.category_id,
        start_s: chapter.start_s,
        end_s:
            i < videoStore.chapters.length - 1
                ? videoStore.chapters[i + 1].start_s
                : Math.floor(videoStore.videoInfo.length_sec),
    }));

    const { error } = await supabase.from('chapters').insert(chapters);
    if (error) throw error;
}

const save = async () => {
    loading.value = true;

    await saveCategories();
    await deleteExistingChapters();
    await saveChapters();
    await videoStore.fetchChapters();

    loading.value = false;
    videoStore.showChapterDrawer = false;

    await sleep(500);
    videoStore.editMode = false;
};

async function cancel(force = false) {
    if (videoStore.hasChapterChanges && !force) {
        showConfirmCancelDialog.value = true;
        return;
    }

    videoStore.resetChaptersForm();
}
</script>

<template>
    <div class="flex flex-col max-h-[80vh]">
        <div class="overflow-x-hidden p-4 pb-0">
            <v-form v-model="valid" v-auto-animate class="flex flex-col gap-4">
                <ManageChaptersRow
                    v-for="(chapter, i) in videoStore.chapters"
                    :key="chapter.id"
                    v-model="videoStore.chapters[i]"
                    :i="i"
                />
            </v-form>
        </div>

        <Empty v-if="!videoStore.chapters?.length" title="No chapters..." description="lekkerAppie"></Empty>

        <div class="p-4 flex flex-col gap-4">
            <v-btn
                @click="videoStore.addEmptyChapter"
                prepend-icon="mdi-plus"
                variant="tonal"
                class="w-full"
                color="primary"
            >
                Add Chapter
            </v-btn>

            <ChapterControlls v-if="videoStore.chapters.length" />
        </div>

        <div class="flex justify-between items-center gap-4 pt-4 p-4 border-t border-black-500">
            <ConfirmDialog
                v-model="showConfirmCancelDialog"
                title="Discard changes"
                description="Are you sure you want to discard your changes?"
                icon="mdi-alert-circle-outline"
                confirm-text="Discard changes"
                :show-close-button="false"
                @confirm="
                    async () => {
                        await sleep(500);
                        await cancel(true);
                    }
                "
            />

            <div>
                <div v-if="videoStore.hasChapterChanges" class="text-muted-more underline italic text-sm">
                    Unsaved changes
                </div>
            </div>

            <div class="flex items-center justify-between gap-4">
                <v-btn v-if="videoStore.hasChapterChanges" variant="text" :loading="resetLoading" @click="cancel()">
                    Discard
                </v-btn>
                <v-btn v-else variant="text" :loading="resetLoading" @click="cancel()"> Back </v-btn>

                <v-btn color="primary" @click="save" :loading="loading" :disabled="!videoStore.hasChapterChanges">
                    Save
                </v-btn>
            </div>
        </div>
    </div>
</template>
