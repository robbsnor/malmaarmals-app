<script setup lang="ts">
import { ref } from 'vue';
import ManageChaptersRow from './ManageChaptersRow.vue';
import { sleep } from '../../shared/helpers/sleep';
import ChapterControlls from './ChapterControlls.vue';
import { useManageChaptersStore } from '../stores/manage-chapters.store';

const manageChaptersStore = useManageChaptersStore();
const showConfirmCancelDialog = ref(false);
</script>

<template>
    <div class="flex flex-col max-h-[60vh]">
        <div class="overflow-x-hidden p-4 pb-0">
            <v-form v-model="manageChaptersStore.valid" v-auto-animate class="flex flex-col gap-4">
                <ManageChaptersRow
                    v-for="(chapter, i) in manageChaptersStore.chapters"
                    :key="chapter.id"
                    v-model="manageChaptersStore.chapters[i]"
                    :i="i"
                />
            </v-form>
        </div>

        <Empty v-if="!manageChaptersStore.chapters?.length" title="No chapters..." description="lekkerAppie"></Empty>

        <div class="p-4 flex flex-col gap-4">
            <v-btn
                @click="manageChaptersStore.addEmptyChapter"
                prepend-icon="mdi-plus"
                variant="tonal"
                class="w-full"
                color="primary"
            >
                Add Chapter
            </v-btn>

            <ChapterControlls />
        </div>

        <div class="flex justify-between items-center gap-4 pt-4 p-4 border-t border-black-500">
            <ConfirmDialog
                v-model="showConfirmCancelDialog"
                title="Discard changes"
                description="Are you sure you want to discard your changes?"
                icon="mdi-alert-circle-outline"
                confirm-text="Discard changes"
                :show-body="false"
                :show-close-button="false"
                @confirm="
                    async () => {
                        await sleep(500);
                        await manageChaptersStore.discard();
                    }
                "
            />

            <div>
                <div v-if="manageChaptersStore.isModified" class="text-muted-more underline italic text-sm">
                    Unsaved changes
                </div>
            </div>

            <div class="flex items-center justify-between gap-4">
                <v-btn v-if="manageChaptersStore.isModified" variant="text" @click="manageChaptersStore.discard()">
                    Discard
                </v-btn>
                <v-btn v-else variant="text" @click="manageChaptersStore.editMode = false"> Cancel </v-btn>

                <v-btn
                    color="primary"
                    variant="tonal"
                    @click="manageChaptersStore.save"
                    :loading="manageChaptersStore.loading"
                    :disabled="!manageChaptersStore.isModified"
                >
                    Save
                </v-btn>
            </div>
        </div>
    </div>
</template>
