<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
    defineProps<{
        video: any;
        isFirst?: boolean;
    }>(),
    {
        isFirst: false,
    }
);

const daysAgo = computed(() => {
    const recordedAt = new Date(props.video.recorded_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - recordedAt.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});
</script>

<template>
    <RouterLink :to="`/videos/${props.video.video_id}`" class="group relative">
        <!-- <img
            :class="props.isFirst ? 'opacity-40' : 'opacity-20'"
            :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
            alt=""
            class="pointer-events-none absolute -z-10 aspect-video scale-200 overflow-hidden rounded-[99%] object-cover blur-2xl select-none"
        /> -->
        <img
            :src="`http://localhost:8000/thumbnails/${props.video.video_id}`"
            alt=""
            class="relative mb-2 aspect-video w-full transition-all group-hover:scale-102 group-hover:shadow-2xl"
            :class="props.isFirst ? 'rounded-2xl' : 'rounded-md'"
        />
        <div class="transition-all">
            <h2 class="truncate font-black uppercase" :class="props.isFirst ? 'text-2xl' : 'text-lg'">
                {{ props.video.title }}
            </h2>
            <p v-if="props.video.description" class="text-black-700 text-sm">
                {{ props.video.description }}
            </p>
            <p class="text-md font-semibold text-gray-500">{{ daysAgo }} days ago</p>

            <!-- <template v-if="props.video.categories.length">
            <div
                v-for="category in props.video.categories"
                :key="category.id"
                class="mt-2 flex items-center gap-2"
            >
                <img :src="category.image_url" alt="" class="rounded-md" />

                <span class="text-sm text-gray-500">
                    {{ category.title }}
                </span>
            </div>
        </template> -->
        </div>
    </RouterLink>
</template>
