<script setup lang="ts">
import { computed, ref } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ResetButton from './ResetButton.vue';

const preferenceStore = usePreferenceStore();
</script>

<template>
    <Admin>
        <div class="flex justify-between items-center gap-4">
            <FormLabel description="Overwrite chat width when in landscape-mode">Chat width</FormLabel>
            <ResetButton v-visible="preferenceStore.chatWidth" @click="preferenceStore.chatWidth = null"></ResetButton>
        </div>

        <div class="flex items-center gap-4">
            <v-number-input
                v-model="preferenceStore.chatWidth"
                :reverse="false"
                controlVariant="default"
                label=""
                placeholder="..."
                :hideInput="false"
                :inset="false"
            ></v-number-input>
            <div class="text-lgf text-muted">px</div>
        </div>
    </Admin>
</template>
