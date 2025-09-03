<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../../supabase';
const videos = ref<{ data: any[]; error: any }>();

onMounted(async () => {
    videos.value = await fetchVideos();
});

const fetchVideos = async () => {
    const { data, error } = await supabase
        .from('videos')
        .select('*, categories: video_category_mapping(...categories(*))')
        .order('recorded_at', { ascending: false })
        .limit(1000);
    return { data, error };
};

const formattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};
</script>

<template>
    <Container>
        <div class="flex">
            <div class="border-black-400 w-[200px] shrink-0 border-r-1">
                <div class="sticky top-0 h-full">
                    <div class="border-black-400 mb-4 border-b-1 py-4">
                        <h2 class="text-xl font-semibold">Filter</h2>
                    </div>

                    <div class="flex flex-col gap-4">
                        <!-- <div>
                            <h3 class="text-lg font-semibold">Year</h3>
                            <div class="pt-2 pl-2">
                                <UCheckbox
                                    v-model="yearAllSelected"
                                    @click="toggleAllYears()"
                                    label="All"
                                    class="mb-1"
                                />

                                <UCheckboxGroup
                                    v-model="filter.years"
                                    :items="yearOptions"
                                />
                            </div>
                        </div>

                        <div>
                            <h3 class="text-lg font-semibold">Type</h3>
                            <URadioGroup
                                class="pt-2 pl-2"
                                v-model="filter.type"
                                :items="typeOptions"
                            />
                        </div> -->
                    </div>
                </div>
            </div>

            {{ videos?.data.length }}
            <div v-if="videos?.data" class="grid grid-cols-5 items-center gap-8 p-4">
                <RouterLink v-for="video in videos.data" :key="video.video_id" :to="`/videos/${video.video_id}`">
                    <div class="relative">
                        <img
                            :src="`http://localhost:8000/thumbnails/${video.video_id}`"
                            alt=""
                            class="pointer-events-none absolute -z-10 aspect-video scale-300 overflow-hidden rounded-[99%] object-cover opacity-10 blur-2xl select-none"
                        />
                        <img
                            :src="`http://localhost:8000/thumbnails/${video.video_id}`"
                            alt=""
                            class="mb-2 rounded-md"
                        />
                    </div>
                    <h2 class="text-md font-bold">{{ video.title }}</h2>
                    <p v-if="video.description" class="text-black-700 text-sm">
                        {{ video.description }}
                    </p>
                    <p class="text-sm text-gray-500">
                        {{ formattedDate(video.recorded_at) }}
                    </p>

                    <!-- <template v-if="video.categories.length">
                        <div
                            v-for="category in video.categories"
                            :key="category.id"
                            class="mt-2 flex items-center gap-2"
                        >
                            <img
                                :src="category.image_url"
                                alt=""
                                class="rounded-md"
                            />

                            <span class="text-sm text-gray-500">
                                {{ category.title }}
                            </span>
                        </div>
                    </template> -->
                </RouterLink>
            </div>
        </div>
    </Container>
</template>
