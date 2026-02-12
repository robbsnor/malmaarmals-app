<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVideoStore } from '../stores/video.store';
import ExtraInfoItem from './ExtraInfoItem.vue';
import { useAuthStore } from '../../auth/stores/auth.store';

const videoStore = useVideoStore();
const authStore = useAuthStore();

const topChattersLength = ref(25);

const topChatters = computed(() => {
    const counts = new Map<number, { userId: number; userName: string; count: number; color: string }>();

    for (const msg of videoStore.messages) {
        const existing = counts.get(msg.user_id);
        if (existing) {
            existing.count++;
        } else {
            counts.set(msg.user_id, { userId: msg.user_id, userName: msg.user_name, count: 1, color: msg.user_color });
        }
    }

    return [...counts.values()].sort((a, b) => b.count - a.count);
});

const myStats = computed(() => {
    const index = topChatters.value.findIndex((c) => c.userId === authStore.twitchUserId);
    return index === -1 ? null : { ...topChatters.value[index], rank: index + 1 };
});
</script>

<template>
    <ExtraInfoItem v-if="!videoStore.messagesLoading" title="Top Chatters">
        <template #actions>
            <div class="text-muted-more">{{ videoStore.messages.length }}</div>
        </template>
        <div>
            <div class="overflow-auto p-4 py-2">
                <div
                    v-for="(chatter, i) in topChatters.slice(0, topChattersLength)"
                    :key="chatter.userName"
                    class="flex justify-between"
                    :class="{
                        // 'text-4xl': i === 0,
                        // 'text-3xl': i === 1,
                        // 'text-2xl': i === 2,
                    }"
                >
                    <div>
                        <span
                            class="text-muted-more font-bold"
                            :class="{
                                // 'text-white': i === 0 || i === 1 || i === 2,
                            }"
                        >
                            {{ i + 1 }}.
                        </span>
                        <span
                            class="font-bold"
                            :style="{
                                color: chatter.color,
                                // textShadow: '0 0 5px ' + chatter.color
                            }"
                        >
                            {{ chatter.userName }}
                        </span>
                    </div>

                    <span>{{ chatter.count }}</span>
                </div>
            </div>

            <template v-if="myStats && myStats.rank > topChattersLength">
                <div class="h-[1px] bg-black-400"></div>
                <div class="flex justify-between p-4 py-3">
                    <div>
                        <span>{{ myStats.rank }}. </span>
                        <span class="font-bold" :style="{ color: myStats.color }">{{ myStats.userName }}: </span>
                    </div>

                    <span class="font-bold">{{ myStats.count }}</span>
                </div>
            </template>
        </div>
    </ExtraInfoItem>
</template>
