<script setup lang="ts">
import { computed } from 'vue';
import { TwitchHelper } from '../../shared/helpers/twitch.helper';

const props = defineProps<{
    id: string;
    title: string;
    secPlayed: number;
    timePlayed: string;
    timesPlayed: number;
    streamCount: number;
    position: number;
}>();

const hoursPlayed = computed(() => {
    const h = Math.floor(props.secPlayed / 3600);
    const m = Math.floor((props.secPlayed % 3600) / 60);
    if (h === 0) return `${m}m`;
    if (m === 0) return `${h}h`;
    return `${h}h ${m}m`;
});
</script>

<template>
    <button
        class="relative flex gap-3.5 overflow-hidden p-2 rounded-lg text-left bg-gradient-to-br from-white/20 to-white/10"
    >
        <!-- <v-img
            :src="TwitchHelper.getCategoryThumbnail(props.id)"
            cover
            class="absolute! inset-0! opacity-10f! blur-xfs!"
        /> -->
        <div class="absolute inset-0 bg-gradient-to-r from-black-100/75 to-black-100"></div>

        <div class="relative w-14 rounded shrink-0 overflow-hidden bg-black-400 aspect-[208/288]">
            <img :src="TwitchHelper.getCategoryThumbnail(props.id)" class="h-full! w-full!" alt="" cover />
        </div>

        <div class="relative py-1 grow">
            <div class="font-bold line-clamp-1 break-all pb-1">
                {{ props.title }}
            </div>
            <div class="flex items-center gap-2">
                <v-icon size="16" color="primary">mdi-clock</v-icon>
                <div class="text-muted font-medium text-sm">{{ hoursPlayed }} played</div>
            </div>
            <div class="flex items-center gap-2">
                <v-icon size="16" color="primary">mdi-play</v-icon>
                <div class="text-muted font-medium text-sm">{{ props.streamCount }} streams</div>
            </div>
        </div>

        <div class="relative text-2xl font-bold pt-1 text-muted-more">#{{ props.position }}</div>
    </button>
</template>
