<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VideoItem from './components/VideoItem.vue';
import VideoItemLarge from './components/VideoItemLarge.vue';
import { useVideosStore } from './stores/videos.store';
import { useArchiveStore } from '../archive/stores/archive.store';
import FilterIndicator from '../archive/components/FilterIndicator.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import Empty from '../shared/components/Empty.vue';

TitleHelper.setTitle('streams');

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();

const INITIAL = 40;
const STEP = 50;
const count = ref(INITIAL);

const displayed = computed(() => videosStore.filteredVideos.slice(0, count.value));
const hasMore = computed(() => count.value < videosStore.filteredVideos.length);
const remaining = computed(() => Math.min(STEP, videosStore.filteredVideos.length - count.value));

function loadMore() {
    count.value += STEP;
}

watch(
    () => archiveStore.debouncedQuery,
    () => {
        count.value = INITIAL;
    }
);

const lekkerSpeurenUrl = computed(
    () => `https://www.lekkerspeuren.nl/?filter=type%3Dvideo%26search%3D${archiveStore.query}`
);
</script>

<template>
    <Section
        title="Streams"
        :more-text="hasMore ? `Show ${remaining} more` : undefined"
        more-icon="mdi-chevron-down"
        v-on="hasMore ? { moreClick: loadMore } : {}"
    >
        <template #actions>
            <div class="flex justify-center gap-2 items-center max-lg:hidden">
                <div class="text-muted-more font-bold whitespace-nowrap">{{ videosStore.videos.length }} streams</div>
            </div>
        </template>

        <FilterIndicator archiveType="STREAMS" />

        <div class="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" v-auto-animate>
            <template v-for="video in displayed" :key="video.video_id">
                <VideoItem :video="video" />
                <VideoItemLarge :video="video" />
            </template>
        </div>

        <Empty
            v-if="archiveStore.query && !hasMore"
            title="Not found what you are looking for?"
            description="It might be on lekkerspeuren.nl"
            icon="mdi-turkey"
        >
            <v-btn
                :href="lekkerSpeurenUrl"
                variant="tonal"
                color="primary"
                target="_blank"
                append-icon="mdi-open-in-new"
            >
                lekkerspeuren.nl
            </v-btn>
        </Empty>

        <!-- nothing found -->
        <Empty
            v-if="archiveStore.query && !videosStore.filteredVideos.length"
            :title="`No video's found...`"
            icon="mdi-magnify"
            description="Try something else, or check lekkerspeuren.nl"
        >
            <div class="flex gap-4 flex-wrap items-center justify-center">
                <v-btn variant="text" color="primary" @click="archiveStore.resetQuery">Show all</v-btn>
                <v-btn
                    :href="lekkerSpeurenUrl"
                    variant="tonal"
                    color="primary"
                    target="_blank"
                    append-icon="mdi-open-in-new"
                >
                    lekkerspeuren.nl
                </v-btn>
            </div>
        </Empty>
    </Section>
</template>
