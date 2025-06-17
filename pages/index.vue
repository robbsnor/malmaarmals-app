<script setup lang="ts">
const supabase = useSupabaseClient()

const { data: videos, error } = await supabase
    .from('videos')
    .select('*, categories: video_category_mapping(...categories(*))')
    .order('recorded_at', { ascending: false })
    .range(120, 1000)

const firstVideo = computed(() => videos?.[0])
const otherVideos = computed(() => videos?.slice(1))
const fakePlaylist = computed(() => videos?.slice(13, 20))

const { data: categories } = await supabase.from('categories').select('*')
const catImg = (url: string) => {
    return url.replace('40x53', '240x318')
}
</script>

<template>
    <div>
        <LatestVideo v-if="firstVideo" :video="firstVideo" />

        <div class="pb-1g flex flex-col gap-16">
            <Container>
                <GridSection v-if="otherVideos" title="Recent streams">
                    <Video
                        v-for="video in otherVideos"
                        :key="video.video_id"
                        :video="video"
                    />
                </GridSection>
            </Container>

            <BackGroundGradient class="py-20">
                <Container>
                    <GridSection
                        v-if="categories"
                        title="Popular Categories"
                        :cols="8"
                        class="py-20f"
                    >
                        <div
                            v-for="category in categories"
                            :key="category.id"
                            class="relative"
                        >
                            <img
                                :src="catImg(category.image_url)"
                                class="pointer-events-none absolute -z-10 w-full scale-200 overflow-hidden rounded-[99%] object-cover opacity-20 blur-2xl select-none"
                            />
                            <img
                                :src="catImg(category.image_url)"
                                alt=""
                                class="w-full rounded-md"
                            />
                        </div>
                    </GridSection>
                </Container>
            </BackGroundGradient>

            <Container>
                <GridSection v-if="otherVideos" title="Playlists">
                    <Video
                        v-for="video in fakePlaylist"
                        :key="video.video_id"
                        :video="video"
                    />
                </GridSection>
            </Container>
        </div>
    </div>
</template>
