<script setup lang="ts">
import { ref } from 'vue';
import { TIME_PRIOR_OFFSET_S } from '../stores/video.store';

const dialog = ref(false);
</script>

<template>
    <Dialog v-model="dialog" title="Instructions" icon="mdi-help-circle-outline" description="How to manage chapters.">
        <template #activator="{ props }">
            <v-btn size="small" v-bind="props" append-icon="mdi-help-circle-outline">Instructions</v-btn>
        </template>

        <div class="fs">
            <h4>How to skip the intro?</h4>
            <p>
                To skip the intro, add the category name '<b class="italic">Intro</b>' and set the time to the first
                moment te intro <b class="underline">STARTS</b>.
            </p>

            <h4>When to put a new marker?</h4>
            <p>
                Set the categories time
                <v-btn size="x-small" variant="tonal" icon="mdi-target" color="var(--color-black-2000)" /> right on the
                moment the game is visible on screen. Once saved, each marker will be placed
                <b>{{ TIME_PRIOR_OFFSET_S }} seconds</b> before the current time for a smoother experience.
            </p>
            <p>So <b>05:30</b> will become <b>05:28</b> for the user.</p>

            <h4>Who can see my chapters?</h4>
            <p>
                Everyone can see the chapters you add to a video. You can also modify existing chapters placed by other
                users.
            </p>
        </div>

        <template #footer>
            <v-btn variant="tonal" @click="dialog = false">close</v-btn>
        </template>
    </Dialog>
</template>
