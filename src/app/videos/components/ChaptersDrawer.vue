<script setup lang="ts">
import { ref, watch } from 'vue';
import { useVideoStore } from '../stores/video.store';
import PlayerButton from './PlayerButton.vue';
import ManageChapters from './ManageChapters.vue';
import ManageChaptersInstructionsDialog from './ManageChaptersInstructionsDialog.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { onKeyStroke } from '@vueuse/core';
import { useManageChaptersStore } from '../stores/manage-chapters.store';
import Chapter from './Chapter.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
const manageChaptersStore = useManageChaptersStore();
const tab = ref();

// onKeyStroke('c', () => {
//     manageChaptersStore.showDrawer = true;
//     manageChaptersStore.editMode = true;

//     if (!manageChaptersStore.chapters.length) {
//         manageChaptersStore.addEmptyChapter();
//     }
// });

watch(
    () => manageChaptersStore.editMode,
    (newVal) => (tab.value = newVal ? 1 : 0),
    { immediate: true }
);
</script>

<template>
    <Drawer v-model="manageChaptersStore.showDrawer" inset title="Chapters" :padding="false">
        <template #activator="{ props }">
            <PlayerButton
                v-bind="props"
                title="chapters toggle"
                icon="mdi-format-list-bulleted"
                :size="24"
                :class="{
                    'text-orange-500': manageChaptersStore.isModified,
                }"
            />
        </template>

        <template #actions>
            <v-btn
                v-if="!manageChaptersStore.editMode && videoStore.chapters.length"
                @click="manageChaptersStore.editMode = true"
                v-admin
                append-icon="mdi-pencil"
                variant="tonal"
                size="small"
                color="primary"
            >
                Edit
            </v-btn>

            <ManageChaptersInstructionsDialog v-if="manageChaptersStore.editMode" />
        </template>

        <v-window v-model="tab" :show-arrows="false" :touch="false">
            <v-window-item>
                <div v-if="videoStore.chapters.length" class="p-4">
                    <Chapter
                        v-for="chapter in videoStore.chapters"
                        :key="chapter.id"
                        :chapter="chapter"
                        @click="manageChaptersStore.showDrawer = false"
                    />
                </div>

                <Empty
                    v-else
                    title="No chapters"
                    icon="mdi-format-list-bulleted"
                    description="PETER vs TIMON and similar streams don't have chapters to prevent spoilers."
                >
                    <div class="flex flex-col gap-4">
                        <v-btn
                            v-admin
                            @click="
                                () => {
                                    manageChaptersStore.editMode = true;
                                    manageChaptersStore.addEmptyChapter();
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
