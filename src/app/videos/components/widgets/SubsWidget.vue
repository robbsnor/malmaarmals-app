<script setup lang="ts">
import Widget from './Widget.vue';
import { useVideoStore } from '../../stores/video.store.ts';
import VideoItem from '../VideoItem.vue';
import { computed } from 'vue';
import type { Message } from '../../models/messages.model.ts';

const videoStore = useVideoStore();
const treshold = 100;

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const cleaned = hex.replace('#', '').trim();

    // Support shorthand hex (#f00 -> #ff0000)
    const fullHex =
        cleaned.length === 3
            ? cleaned
                  .split('')
                  .map((c) => c + c)
                  .join('')
            : cleaned;

    if (!/^[0-9a-fA-F]{6}$/.test(fullHex)) {
        return null;
    }

    const r = parseInt(fullHex.substring(0, 2), 16);
    const g = parseInt(fullHex.substring(2, 4), 16);
    const b = parseInt(fullHex.substring(4, 6), 16);

    return { r, g, b };
}

function isBlue(hex: string): boolean {
    const rgb = hexToRgb(hex);
    if (!rgb) return false;

    const { r, g, b } = rgb;
    // Blue channel clearly dominant over both red and green
    return b > r + treshold && b > g + treshold;
}

function isRed(hex: string): boolean {
    const rgb = hexToRgb(hex);
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
    <Widget title="Teams">
        <div v-if="teams" class="pt-4 flex flex-col gap-4">
            <div class="flex rounded-md overflow-hidden">
                <div class="bg-red-500 shrink-0 p-4" :style="{ width: `${teams.red.percentage}%` }">
                    {{ teams.red.percentage }}%
                </div>
                <div class="bg-blue-500 w-full shrink-0 p-4">{{ teams.blue.percentage }}%</div>
            </div>

            <div class="grid grid-cols-2 gap-4 max-h-80 overflow-auto">
                <div>
                    {{ teams.red.users.length }}
                    <div v-for="user in teams.red.users" :key="user.user_id">
                        <span>
                            <img
                                v-for="badge in user.badges"
                                :key="badge.image_id"
                                alt=""
                                :src="`https://static-cdn.jtvnw.net/badges/v1/${badge.image_id}/2`"
                                class="inline-block mr-1 h-5 -mt-[2px]"
                        /></span>
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
                    {{ teams.blue.users.length }}
                    <div v-for="user in teams.blue.users" :key="user.user_id">
                        <span>
                            <img
                                v-for="badge in user.badges"
                                :key="badge.image_id"
                                alt=""
                                :src="`https://static-cdn.jtvnw.net/badges/v1/${badge.image_id}/2`"
                                class="inline-block mr-1 h-5 -mt-[2px]"
                        /></span>
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
                <Skeleton class="h-14 w-2/3" />
                <Skeleton class="h-14 grow" />
            </div>

            <div class="grid grid-cols-2 gap-4">
                <div v-for="i in 2" class="flex flex-col gap-4" :key="i">
                    <Skeleton v-for="j in 8" class="h-6" :key="j" />
                </div>
            </div>
        </div>
    </Widget>
</template>
