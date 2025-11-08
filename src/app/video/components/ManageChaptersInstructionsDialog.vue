<script setup lang="ts">
import { ref } from 'vue';
import { TIME_PRIOR_OFFSET_S } from '../stores/video.store';

const dialog = ref(false);
</script>

<template>
    <Dialog v-model="dialog" title="Instructions" icon="mdi-information-outline" description="How to manage chapters.">
        <template #activator="{ props }">
            <v-btn size="x-small" v-bind="props" icon="mdi-information-outline" />
        </template>

        <div class="fs">
            <h4>1. Offset</h4>
            <p>
                Set the categories time
                <v-btn size="x-small" variant="tonal" icon="mdi-target" color="var(--color-black-2000)" /> right on the
                moment the game is visible on screen. Once saved, each marker will be placed
                <b>{{ TIME_PRIOR_OFFSET_S }} seconds</b> before the current time for a smoother experience.
            </p>
            <p>So <b>05:30</b> will become <b>05:28</b> for the user.</p>

            <h4>2. Editing</h4>
            <p>
                Starting editing a video and adding chapters makes you the owner of it, only you can add, delete or
                modify chapters on that video.
            </p>
        </div>

        <template #footer>
            <v-btn variant="tonal" @click="dialog = false">close</v-btn>
        </template>
    </Dialog>
</template>
