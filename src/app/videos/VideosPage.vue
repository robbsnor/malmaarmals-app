<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import VideoItem from './components/VideoItem.vue';
import VideoItemLarge from './components/VideoItemLarge.vue';
import { useVideosStore } from './stores/videos.store';
import { useArchiveStore } from '../archive/stores/archive.store';
import FilterIndicator from '../archive/components/FilterIndicator.vue';
import { TitleHelper } from '../shared/helpers/title.helper';
import Empty from '../shared/components/Empty.vue';
import { useDisplay } from 'vuetify';

TitleHelper.setTitle('streams');

const videosStore = useVideosStore();
const archiveStore = useArchiveStore();
const { lgAndUp } = useDisplay();

const lekkerSpeurenUrl = computed(
    () => `https://www.lekkerspeuren.nl/?filter=type%3Dstream%26search%3D${archiveStore.form.query}`
);
</script>

<template>
    <div>
        <Section
            title="Streams"
            :more-text="archiveStore.hasMore ? `Show more` : undefined"
            :show-header="lgAndUp"
            more-icon="mdi-chevron-down"
            v-on="archiveStore.hasMore ? { moreClick: archiveStore.loadMore } : {}"
        >
            <template #actions>
                <div class="flex justify-center gap-2 items-center max-lg:hidden">
                    <div class="text-muted-more font-bold whitespace-nowrap">
                        {{ videosStore.videos.length }} streams
                    </div>
                </div>
            </template>

            <FilterIndicator archiveType="STREAMS" />

            <div class="grid grid-cols-1 gap-4 lg:gap-6 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5" v-auto-animate>
                <template v-for="video in archiveStore.displayed" :key="video.video_id">
                    <VideoItem v-if="!lgAndUp" :video="video" />
                    <VideoItemLarge v-else :video="video" />
                </template>
            </div>

            <!-- nothing found -->
            <Empty
                v-if="archiveStore.form.query && !archiveStore.filteredVideos.length"
                :title="`No videos found...`"
                icon="mdi-play"
                description="Try something else, or check lekkerspeuren.nl"
            >
                <div class="flex flex-row-reverse gap-4 flex-wrap items-center justify-center">
                    <v-btn
                        :href="lekkerSpeurenUrl"
                        variant="tonal"
                        color="primary"
                        target="_blank"
                        append-icon="mdi-open-in-new"
                    >
                        lekkerspeuren.nl
                    </v-btn>
                    <v-btn variant="tonal" color="primary" @click="archiveStore.formReset()">Clear filters</v-btn>
                </div>
            </Empty>
        </Section>

        <Section v-if="archiveStore.form.query && !archiveStore.hasMore && archiveStore.filteredVideos.length">
            <!-- find more on lekkerspeuren  -->
            <Empty>
                <template #description>
                    <div>Not found what you are looking for?</div>
                    <div>It might be on lekkerspeuren.nl</div>
                </template>

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
        </Section>
    </div>
</template>
