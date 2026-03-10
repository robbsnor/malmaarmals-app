<script setup lang="ts">
import { computed, ref } from 'vue';
import AddOrEditPlaylistForm from './AddOrEditPlaylistForm.vue';

const sheet = ref(false);
const formRef = ref<InstanceType<typeof AddOrEditPlaylistForm>>();

function onCreateSuccess() {
    sheet.value = false;
}
</script>

<template>
    <v-btn v-auth icon="mdi-plus" class="rounded!" size="small" color="primary" variant="tonal" @click="sheet = true">
    </v-btn>

    <Dialog v-model="sheet" inset title="Create Playlist">
        <AddOrEditPlaylistForm ref="formRef" @success="onCreateSuccess" />

        <template #footer>
            <v-btn class="text-muted!" variant="text"> cancel </v-btn>
            <v-btn
                color="primary"
                :disabled="!formRef?.valid"
                :loading="formRef?.loading"
                variant="tonal"
                @click="formRef?.submit"
            >
                Create
            </v-btn>
        </template>
    </Dialog>
</template>
