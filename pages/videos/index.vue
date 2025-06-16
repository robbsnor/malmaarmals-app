<script setup lang="ts">
import { VIDEOS_MOCK } from '~/data/videos.mock'
import type { CheckboxGroupItem } from '~/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue'
import type { RadioGroupItem } from '~/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue'

const supabase = useSupabaseClient()
const years = ref([
    '2025',
    '2024',
    '2023',
    '2022',
    '2021',
    '2020',
    '2019',
    '2018',
    '2017',
    '2016',
    '2015',
    '2014',
    '2013',
    '2012',
])
const filterDefault = ref({
    years: years.value.slice(0, 3),
    type: 'video',
})

const filter = ref(filterDefault.value)
const yearAllSelected = computed(
    () => filter.value.years.length === years.value.length,
)
const yearOptions = ref<CheckboxGroupItem[]>(years.value)
const typeOptions = ref<RadioGroupItem[]>([
    {
        label: 'Videos',
        value: 'video',
    },
    {
        label: 'Playlists',
        value: 'playlist',
    },
])

const videos = ref([])
onMounted(async () => {
    const { data: videosData, error: videoError } = await supabase
        .from('videos')
        .select('*')
        .order('recorded_at', { ascending: false })

    if (videoError) return console.error('Error fetching videos:', videoError)

    videos.value = videosData
})

const toggleAllYears = () => {
    if (!yearAllSelected.value) {
        filter.value.years = years.value
    } else {
        filter.value.years = []
    }
}

const filteredVideos = computed(() => {
    return videos.value.filter((video) => {
        const isYearMatch = filter.value.years.includes(video.year.toString())
        const isTypeMatch = video.type === filter.value.type

        return isYearMatch && isTypeMatch
    })
})

const res = await $fetch('/api/thumbnails')
</script>

<template>
    <Container>
        <div class="flex">
            <div class="border-black-400 w-[200px] border-r-1">
                <div class="sticky top-0 h-full">
                    <div class="border-black-400 mb-4 border-b-1 py-4">
                        <h2 class="text-xl font-semibold">Filter</h2>
                    </div>

                    <div class="flex flex-col gap-4">
                        <div>
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
                        </div>
                    </div>
                </div>
            </div>

            <Videos :videos="videos" />
        </div>
    </Container>
</template>
