<script setup lang="ts">
import Widget from './Widget.vue';
import { useVideoStore } from '../../stores/video.store.ts';
import { computed } from 'vue';
import { ColorHelper } from '../../../shared/helpers/color.helper.ts';
import { TwitchHelper } from '../../../shared/helpers/twitch.helper.ts';
import { BADGE_IMAGE_IDS } from '../../../shared/data/subbadges.data.ts';
import Admin from '../../../shared/components/Admin.vue';

const videoStore = useVideoStore();
const groups = computed(() => {
    const groups: {
        badge: string;
        users: {
            name: string;
            color: string;
        }[];
    }[] = [];

    videoStore.uniqueUsers.forEach((message) => {
        const badge = message.badges[0]?.image_id;
        if (!badge) return;

        const existingBadge = groups.find((g) => g.badge === badge);
        const user = {
            name: message.user_name,
            color: message.user_color,
        };

        if (existingBadge) {
            existingBadge.users.push(user);
        } else {
            groups.push({
                badge: badge,
                users: [user],
            });
        }
    });

    return groups.sort((a, b) => b.users.length - a.users.length);
});
</script>

<template>
    <Admin>
        <Widget title="Subscribers">
            <div v-if="!videoStore.messagesLoading" class="flex gap-4">
                <div v-for="group in groups" :key="group.badge">
                    <div>
                        <img alt="" :src="TwitchHelper.getBadgeUrl(group.badge)" class="h-8" />
                        <div>{{ group.users.length }}</div>
                        <div v-for="user in group.users" :key="user.name" class="flex gap-4">
                            <span
                                :style="{
                                    color: user.color || '#2e8b57',
                                }"
                                class="font-bold"
                            >
                                {{ user.name }}
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
    </Admin>
</template>
