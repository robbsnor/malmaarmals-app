<script setup lang="ts">
import { computed, ref } from 'vue';
import { useArchiveStore } from '../stores/archive.store';
import { useVideosStore } from '../../videos/stores/videos.store';
import { usePlaylistsStore } from '../../playlists/stores/playlists.store';
import { DateHelper } from '../../shared/helpers/date.helper';

const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
const playlistsStore = usePlaylistsStore();

const props = defineProps<{
    archiveType: 'STREAMS' | 'PLAYLISTS' | 'GAMES';
    totalResults?: number;
}>();

const resultsLength = computed(() => {
    if (props.totalResults !== undefined) {
        return props.totalResults;
    }

    if (props.archiveType === 'STREAMS') {
        return archiveStore.filteredVideos.length;
    } else if (props.archiveType === 'PLAYLISTS') {
        return playlistsStore.filteredPlaylists.length;
    } else if (props.archiveType === 'GAMES') {
        const query = archiveStore.form.query?.toLowerCase();
        if (!query) return videosStore.populairCategories.length;

        return videosStore.populairCategories.filter((category) => category.title.toLowerCase().includes(query)).length;
    }
});
</script>

<template>
    <div v-if="archiveStore.formHasChanges" class="pb-3 text-muted max-lg:hidden flex gap-2">
        <span>{{ resultsLength }} Results for: </span>
        <span v-if="archiveStore.form.query" class="text-primary font-bold">"{{ archiveStore.form.query }}"</span>

        <span v-if="archiveStore.form.years.length">
            year:
            <span class="text-primary font-bold"> "{{ archiveStore.form.years.join(', ') }}"</span>
        </span>

        <span v-if="archiveStore.form.months.length">
            month:
            <span class="text-primary font-bold">
                "{{
                    archiveStore.form.months
                        .map((m) => DateHelper.getMonthName(m))
                        .join(', ')
                        .toLocaleLowerCase()
                }}"
            </span>
        </span>

        <v-btn
            variant="tonal"
            color="primary"
            size="small"
            class="ml-2"
            prepend-icon="mdi-close"
            @click="archiveStore.formReset()"
        >
            show all
        </v-btn>
    </div>
</template>
