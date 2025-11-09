<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';
import CategoryThumbnail from './CategoryThumbnail.vue';
import { prettyTime } from '../../shared/helpers/prettyTime';
import ManageChapters from './ManageChapters.vue';
import { supabase } from '../../../supabase';
import { sleep } from '../../shared/helpers/sleep';
import { v4 } from 'uuid';
import ChapterControlls from './ChapterControlls.vue';

const drawer = ref<boolean>(true);
const videoStore = useVideoStore();
const valid = ref(false);
const loading = ref(false);
const resetLoading = ref(false);

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
    drawer.value = false;

    await sleep(500);
    videoStore.editMode = false;
};

async function cancel() {
    // await sleep(500);
    videoStore.resetChaptersForm();
    videoStore.editMode = false;
}

function skipToSec(sec: number) {
    videoStore.setTimePrior(sec);

    videoStore.playing = true;
    videoStore.showControllsAndInfo = true;
    drawer.value = false;
}
</script>

<template>
    <Drawer v-model="drawer" inset title="Chapters">
        <template #activator="{ props }">
            <PlayerButton
                v-if="videoStore.chapters?.length"
                v-bind="props"
                icon="mdi-format-list-bulleted"
                :size="24"
            />
        </template>

        <template #actions>
            <v-btn
                v-if="!videoStore.editMode"
                @click="videoStore.editMode = true"
                icon="mdi-pencil"
                variant="tonal"
                size="x-small"
                color="primary"
            >
            </v-btn>
        </template>

        <!-- manage chapters -->
        <ManageChapters />

        <!-- display chapters -->
        <div v-if="!videoStore.editMode" class="flex flex-col gap-2">
            <button
                v-for="chapter in videoStore.chapters"
                :key="chapter.start_s"
                @click="skipToSec(chapter.start_s)"
                class="flex items-center gap-4 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
            >
                <CategoryThumbnail :category="chapter.category" />

                <div class="overflow-hidden">
                    <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                    <div class="text-muted text-sm">{{ prettyTime(videoStore.getTimePrior(chapter.start_s)) }}</div>
                </div>
                <v-icon class="ml-auto" color="var(--color-text-muted)">mdi-chevron-right</v-icon>
            </button>
        </div>

        <template v-if="videoStore.editMode" #footer>
            <div v-if="videoStore.chapters.length" class="border-b border-black-500 p-4 pt-0 mb-4 -mx-4">
                <ChapterControlls />
            </div>

            <div class="flex justify-between items-center gap-4">
                <div>
                    <div v-if="videoStore.hasChapterChanges" class="text-muted-more underline italic text-sm">
                        Unsaved changes
                    </div>
                </div>

                <div class="flex items-center justify-between gap-4">
                    <v-btn variant="text" :loading="resetLoading" @click="cancel"> Cancel </v-btn>

                    <v-btn color="primary" @click="save" :loading="loading" :disabled="!videoStore.hasChapterChanges">
                        Save
                    </v-btn>
                </div>
            </div>
        </template>
    </Drawer>
</template>
