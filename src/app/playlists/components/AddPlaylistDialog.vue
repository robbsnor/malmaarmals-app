<script setup lang="ts">
import { computed, ref } from 'vue';
import AddPlaylistForm from './AddPlaylistForm.vue';

const dialog = ref(false);
const formRef = ref<InstanceType<typeof AddPlaylistForm>>();

function onCreateSuccess() {
    dialog.value = false;
}
</script>

<template>
    <v-btn v-auth icon="mdi-plus" class="rounded!" size="small" color="primary" variant="tonal" @click="dialog = true">
    </v-btn>

    <Dialog v-model="dialog" icon="mdi-plus" title="Create playlist">
        <AddPlaylistForm ref="formRef" @success="onCreateSuccess" />

        <template #footer>
            <v-btn class="text-muted!" variant="text" @click="dialog = false"> cancel </v-btn>
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
