<script setup lang="ts">
import { ref, watch } from 'vue';
import { useVideosStore } from '../stores/videos.store';
import { supabase } from '../../../supabase';
import BottomSheetContainer from '../../shared/components/BottomSheetContainer.vue';
import { useTwitch } from '../../shared/composables/useTwitch.composable';

const videoStore = useVideosStore();
const twitch = useTwitch();
const form = ref({
    startTime: null,
    endTime: null,
    category: null,
});
const valid = ref(false);
const loading = ref(false);
const rules = [
    (value) => {
        if (value) return true;
        return 'Field is required.';
    },
];

const categories = ['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming'];

watch(
    () => form.value.category,
    (newCategory) => {
        console.log(newCategory);
    }
);

async function fetchTwitchCategories(e) {
    console.log(e);
    const { data } = await twitch.getGames({ names: [e] });
    console.log(data);
    // Placeholder for fetching categories from Twitch API
}

const submit = async () => {
    loading.value = true;

    // const { error } = await supabase.from('playlist_videos').insert({
    //     playlist_id: form.value.playlist_id,
    //     video_id: videostore.videoInfo.id,
    // });

    // loading.value = false;
    // if (error) return console.log(error);

    // form.value = { ...formDefault };
    // await playlistsStore.fetchPlaylists();
};
</script>

<template>
    <div class="absolute top-8 right-8 z-60 w-180">
        <BottomSheetContainer>
            <div class="font-bold text-lg mb-4">Add chapters</div>
            <v-form v-model="valid" class="flex flex-col gap-4">
                <div class="flex gap-4 items-start">
                    <div class="w-50">
                        <v-number-input
                            v-model="form.startTime"
                            :rules="rules"
                            :reverse="false"
                            controlVariant="stacked"
                            label="Start time (s)"
                            :hideInput="false"
                            :inset="false"
                        />
                    </div>

                    <v-autocomplete
                        @update:search="fetchTwitchCategories"
                        label="Category"
                        v-model="form.category"
                        :rules="rules"
                        :items="categories"
                    />
                </div>

                <v-btn
                    color="primary"
                    :disabled="!valid"
                    :loading="loading"
                    class="w-full"
                    @click="submit"
                    prepend-icon="mdi-plus"
                >
                    Add to playlist
                </v-btn>
            </v-form>
        </BottomSheetContainer>
    </div>
</template>
