<script setup lang="ts">
import Widget from './Widget.vue';
import { useVideoStore } from '../../stores/video.store.ts';
import { computed } from 'vue';
import { ColorHelper } from '../../../shared/helpers/color.helper.ts';
import { TwitchHelper } from '../../../shared/helpers/twitch.helper.ts';

const videoStore = useVideoStore();
const treshold = 88;

function isBlue(hex: string): boolean {
    const rgb = ColorHelper.hexToRgb(hex);
    if (!rgb) return false;

    const { r, g, b } = rgb;
    // Blue channel clearly dominant over both red and green
    return b > r + treshold && b > g + treshold;
}

function isRed(hex: string): boolean {
    const rgb = ColorHelper.hexToRgb(hex);
    if (!rgb) return false;

    const { r, g, b } = rgb;
    // Red channel clearly dominant over both green and blue
    return r > g + treshold && r > b + treshold;
}

const teams = computed(() => {
    if (!videoStore.uniqueUsers.length) return;
    let redUsers = [];
    let blueUsers = [];

    videoStore.uniqueUsers.forEach((user) => {
        if (!user.user_color) return;
        if (isRed(user.user_color)) redUsers.push(user);
        if (isBlue(user.user_color)) blueUsers.push(user);
    });

    const redPercentage = Math.round((100 / (redUsers.length + blueUsers.length)) * redUsers.length);
    const bluePercentage = 100 - redPercentage;

    return {
        red: {
            users: redUsers,
            percentage: redPercentage,
        },
        blue: {
            users: blueUsers,
            percentage: bluePercentage,
        },
    };
});
</script>

<template>
    <Widget title="PETER vs TIMON">
        <div v-if="teams" class="pt-4">
            <div class="relative flex rounded-md">
                <div
                    class="relative bg-red-500 shrink-0 px-4 py-2 rounded-l-md overflow-hidden"
                    :style="{ width: `${teams.red.percentage}%` }"
                >
                    <div class="absolute font-bold opacity-20 -top-4 -left-6 leading-tight uppercase text-[100px]">
                        peter
                    </div>
                    <div class="relative z-1">
                        <div class="text-xl leading-tight font-bold">{{ teams.red.percentage }}%</div>
                        <div class="text-sm leading-tight font-bold text-black-800">
                            {{ teams.red.users.length }} chatters
                        </div>
                    </div>
                </div>

                <div class="absolute w-[4px] rounded-full -translate-x-1/2 -top-2 -bottom-2 bg-white/75 left-1/2"></div>

                <div class="relative bg-blue-500 grow shrink-0 px-4 py-2 rounded-r-md overflow-hidden">
                    <div class="absolute font-bold opacity-20 -top-4 -left-6 leading-tight uppercase text-[100px]">
                        timon
                    </div>
                    <div class="relative z-1">
                        <div class="text-xl leading-tight font-bold">{{ teams.blue.percentage }}%</div>
                        <div class="text-sm leading-tight font-bold text-black-800">
                            {{ teams.blue.users.length }} chatters
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 max-h-[400px] overflow-auto pt-2 mt-2">
                <div>
                    <div v-for="user in teams.red.users" :key="user.user_id">
                        <img
                            v-for="badge in user.badges"
                            :key="badge.image_id"
                            alt=""
                            :src="TwitchHelper.getBadgeUrl(badge.image_id)"
                            class="inline-block mr-1 h-5 -mt-[2px]"
                        />
                        <span
                            :style="{
                                color: user.user_color || '#2e8b57',
                            }"
                            class="font-bold"
                            :data-user-id="user.user_id"
                        >
                            {{ user.user_name }}
                        </span>
                    </div>
                </div>

                <div>
                    <div v-for="user in teams.blue.users" :key="user.user_id">
                        <img
                            v-for="badge in user.badges"
                            :key="badge.image_id"
                            alt=""
                            :src="TwitchHelper.getBadgeUrl(badge.image_id)"
                            class="inline-block mr-1 h-5 -mt-[2px]"
                        />
                        <span
                            :style="{
                                color: user.user_color || '#2e8b57',
                            }"
                            class="font-bold"
                            :data-user-id="user.user_id"
                        >
                            {{ user.user_name }}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div v-else class="pt-4 flex flex-col gap-4">
            <div class="flex gap-4">
                <Skeleton class="bg-black-400 h-14 w-2/3" />
                <Skeleton class="bg-black-400 h-14 grow" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div v-for="i in 2" class="flex flex-col gap-4" :key="i">
                    <Skeleton v-for="j in 6" class="bg-black-400 h-6" :key="j" />
                </div>
            </div>
        </div>
    </Widget>
</template>
