<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        video: any
    }>(),
    {},
)

const daysAgo = (date: string) => {
    const recordedDate = new Date(date)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - recordedDate.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

function truncateStringArray(titles: string[], maxLength: number = 20): string {
    return titles
        .map((title) =>
            title.length > maxLength
                ? title.slice(0, maxLength).trim() + '...'
                : title,
        )
        .join(', ')
}
</script>

<template>
    <Container>
        <div class="grid grid-cols-2 items-center gap-8 py-30">
            <div class="relative">
                <img
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    class="pointer-events-none absolute -z-10 aspect-video scale-200 overflow-hidden rounded-[99%] object-cover opacity-20 blur-2xl select-none"
                />
                <img
                    :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
                    class="aspect-video w-full rounded-4xl shadow-[0_0_150px_rgba(0,0,0,1)] transition-all"
                />
            </div>

            <div class="z-10">
                <div
                    class="flex items-center gap-2 font-black text-gray-500 text-shadow-md"
                >
                    <div>Newest Video</div>
                    <div class="text-sm italic">
                        ({{ daysAgo(props.video.recorded_at) }} days ago)
                    </div>
                </div>

                <div class="pt-2 text-5xl font-black">
                    {{ props.video.title }}
                </div>

                <div
                    v-if="props.video.description"
                    class="text-3xl font-black text-gray-400"
                >
                    {{ props.video.description }}
                </div>

                <div
                    v-if="props.video.categories.length"
                    class="text-md flexf pt-2 font-semibold text-gray-500"
                >
                    {{
                        truncateStringArray(
                            props.video.categories.map((c) => c.title),
                            20,
                        )
                    }}
                </div>

                <div></div>
            </div>
        </div>
    </Container>
</template>
