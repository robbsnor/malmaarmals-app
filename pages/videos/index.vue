<script setup lang="ts">
import { VIDEOS_MOCK } from '~/data/videos.mock'
import type { CheckboxGroupItem } from '~/node_modules/@nuxt/ui/dist/runtime/components/CheckboxGroup.vue'
import type { RadioGroupItem } from '~/node_modules/@nuxt/ui/dist/runtime/components/RadioGroup.vue'

const years = [
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
]

const filter = ref({ years: years, type: 'video' })
const yearAll = computed({
    get: () => filter.value.years.length === years.length,
    set: (value) => {
        if (value) {
            filter.value.years = years
        } else {
            filter.value.years = []
        }
    },
})
const yearOptions = ref<CheckboxGroupItem[]>(years)
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

const toggleAllYears = () => {
    if (!yearAll.value) {
        filter.value.years = years
    } else {
        filter.value.years = []
    }
}

const videos = ref(VIDEOS_MOCK)
const filteredVideos = computed(() => {
    return videos.value.filter((video) => {
        const isYearMatch = filter.value.years.includes(video.year.toString())
        const isTypeMatch = video.type === filter.value.type

        return isYearMatch && isTypeMatch
    })
})
</script>

<template>
    <div class="flex gap-4">
        <div>
            <h2>Filter options</h2>

            <div class="flex flex-col gap-4">
                <div>
                    <h3>Year</h3>
                    <UCheckbox
                        v-model="yearAll"
                        @click="toggleAllYears()"
                        label="All"
                        class="mb-1"
                    />
                    <UCheckboxGroup
                        v-model="filter.years"
                        :items="yearOptions"
                    />
                </div>

                <div>
                    <h3>type</h3>
                    <URadioGroup v-model="filter.type" :items="typeOptions" />
                </div>
            </div>
        </div>

        <div class="flex-1">
            <h2>videos</h2>
            <div
                class="grid gap-4"
                style="
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                "
            >
                <NuxtLink
                    v-for="video in filteredVideos"
                    :key="video.id"
                    class="flex flex-col rounded-lg bg-slate-800 p-4"
                    :to="`/videos/${video.id}`"
                >
                    <h3>title: {{ video.title }}</h3>
                    <p>description: {{ video.description }}</p>
                    <p>Year: {{ video.year }}</p>
                    <p>Type: {{ video.type }}</p>
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
