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
            <template #append-title>
                <button
                    title="random stream"
                    class="hover:text-primary p-1 py-1.5 lbg-red-500 relative text-muted"
                    @click="archiveStore.setRandomVideo()"
                >
                    <svg
                        fill="currentColor"
                        height="20px"
                        width="20px"
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlns:xlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 512 512"
                        xml:space="preserve"
                    >
                        <g>
                            <g>
                                <g>
                                    <path
                                        d="M21.333,149.327H64c18.773,0,37.227,4.928,53.333,14.272c3.371,1.963,7.061,2.88,10.688,2.88
				c7.36,0,14.528-3.819,18.475-10.624c5.931-10.197,2.432-23.253-7.744-29.163C116.117,113.594,90.283,106.66,64,106.66H21.333
				C9.536,106.66,0,116.218,0,127.994S9.536,149.327,21.333,149.327z"
                                    />
                                    <path
                                        d="M320,149.327h42.667v64c0,8.192,4.715,15.68,12.075,19.221c2.965,1.408,6.123,2.112,9.259,2.112
				c4.757,0,9.472-1.6,13.333-4.672L504,144.655c5.056-4.053,8-10.176,8-16.661c0-6.485-2.944-12.608-8-16.661L397.333,25.999
				c-6.421-5.12-15.232-6.101-22.592-2.56s-12.075,11.029-12.075,19.221v64H320c-82.325,0-149.333,66.987-149.333,149.333
				c0,58.816-47.851,106.667-106.667,106.667H21.333C9.536,362.66,0,372.218,0,383.994s9.536,21.333,21.333,21.333H64
				c82.325,0,149.333-66.987,149.333-149.333C213.333,197.178,261.184,149.327,320,149.327z"
                                    />
                                    <path
                                        d="M504,367.336l-106.667-85.333c-6.421-5.141-15.232-6.123-22.592-2.581c-7.36,3.563-12.075,11.029-12.075,19.243v64H320
				c-21.077,0-41.472-6.144-58.965-17.771c-9.856-6.485-23.061-3.861-29.568,5.973c-6.528,9.813-3.861,23.061,5.952,29.568
				c24.512,16.277,53.056,24.896,82.581,24.896h42.667v64c0,8.192,4.715,15.68,12.075,19.221c2.965,1.408,6.123,2.112,9.259,2.112
				c4.757,0,9.472-1.6,13.333-4.672L504,400.659c5.056-4.053,8-10.197,8-16.661C512,377.512,509.056,371.368,504,367.336z"
                                    />
                                </g>
                            </g>
                        </g>
                    </svg>
                </button>
            </template>

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
