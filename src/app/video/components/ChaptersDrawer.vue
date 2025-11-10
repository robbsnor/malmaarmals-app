<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';
import CategoryThumbnail from './CategoryThumbnail.vue';
import { prettyTime } from '../../shared/helpers/prettyTime';
import ManageChapters from './ManageChapters.vue';
import ManageChaptersInstructionsDialog from './ManageChaptersInstructionsDialog.vue';
import { sleep } from '../../shared/helpers/sleep';

const videoStore = useVideoStore();

const tab = ref();

watch(
    () => videoStore.editMode,
    (newVal) => (tab.value = newVal ? 1 : 0),
    { immediate: true }
);

function skipToSec(sec: number) {
    videoStore.setTimePrior(sec);

    videoStore.playing = true;
    videoStore.showControllsAndInfo = true;
    videoStore.showChapterDrawer = false;
}
</script>

<template>
    <Drawer v-model="videoStore.showChapterDrawer" inset title="Chapters" :padding="false">
        <template #activator="{ props }">
            <PlayerButton v-bind="props" icon="mdi-format-list-bulleted" :size="24" />
        </template>

        <template #actions>
            <v-btn
                v-if="!videoStore.editMode && videoStore.chapters?.length"
                @click="videoStore.editMode = true"
                icon="mdi-pencil"
                variant="tonal"
                size="x-small"
                color="primary"
            >
            </v-btn>

            <ManageChaptersInstructionsDialog v-if="videoStore.editMode" />
        </template>

        <v-window v-model="tab" :show-arrows="false" :touch="false">
            <v-window-item>
                <div v-if="videoStore.chapters?.length" class="flex flex-col gap-2 p-4">
                    <button
                        v-for="chapter in videoStore.chapters"
                        :key="chapter.start_s"
                        @click="skipToSec(chapter.start_s)"
                        class="flex items-center gap-4 p-3 bg-black-300 border border-black-500 rounded-md shrink-0 text-left transition-all hover:bg-black-400"
                    >
                        <CategoryThumbnail :category="chapter.category" />

                        <div class="overflow-hidden">
                            <div class="font-bold pr-2 truncate">{{ chapter.category.title }}</div>
                            <div class="text-muted text-sm">
                                {{ prettyTime(videoStore.getTimePrior(chapter.start_s)) }}
                            </div>
                        </div>
                        <v-icon class="ml-auto" color="var(--color-text-muted)">mdi-chevron-right</v-icon>
                    </button>
                </div>

                <Empty
                    v-else
                    title="No chapters..."
                    description="Add your first chapter to get started!"
                    icon="mdi-format-list-bulleted"
                >
                    <div class="flex flex-col gap-4">
                        <v-btn
                            @click="
                                () => {
                                    videoStore.editMode = true;
                                    videoStore.addEmptyChapter();
                                    videoStore.playing = false;
                                }
                            "
                            color="primary"
                            prepend-icon="mdi-plus"
                        >
                            Add Chapters
                        </v-btn>
                    </div>
                </Empty>
            </v-window-item>

            <v-window-item>
                <ManageChapters />
            </v-window-item>
        </v-window>
    </Drawer>
</template>
