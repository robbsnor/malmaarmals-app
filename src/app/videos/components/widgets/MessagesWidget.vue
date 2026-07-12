<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../../../auth/stores/auth.store.ts';
import { useVideoStore } from '../../stores/video.store.ts';
import Widget from './Widget.vue';
import Message from '../Message.vue';
import { formatTime } from 'vuetify/lib/util/timeUtils.mjs';

const videoStore = useVideoStore();
const authStore = useAuthStore();

const topChattersLength = ref(15);

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

const topEmotes = computed(() => {
    const counts = new Map<string, number>();

    for (const msg of videoStore.messages) {
        const text = msg.text.trim();
        if (!text.toLowerCase().startsWith('lekker')) {
            continue;
        }

        const firstSpaceIndex = text.indexOf(' ');
        const emote = firstSpaceIndex === -1 ? text : text.slice(0, firstSpaceIndex);
        counts.set(emote, (counts.get(emote) ?? 0) + 1);
    }

    return [...counts.entries()].map(([emote, count]) => ({ emote, count })).sort((a, b) => b.count - a.count);
});

const broCounter = computed(() => {
    return videoStore.messages.filter((msg) => msg.text.toLowerCase().includes('bro')).length;
});

const myStats = computed(() => {
    const index = topChatters.value.findIndex((c) => c.userId === authStore.twitchUserId);
    return index === -1 ? null : { ...topChatters.value[index], rank: index + 1 };
});

const tab = ref(1);

const myMessages = computed(() => {
    return videoStore.messages.filter((m) => {
        const isMention = m.text.includes(
            authStore.session.user?.user_metadata?.nickname || authStore.session.user?.user_metadata?.name
        );

        return m.user_id === authStore.twitchUserId || isMention;
    });
});
</script>

<template>
    <Widget title="Chat stats">
        <template v-if="videoStore.messages.length">
            <v-tabs v-model="tab" density="compact" color="primary" grow>
                <v-tab text="Top chatters" :value="1"></v-tab>
                <!-- <v-tab text="Top emotes" :value="2"></v-tab> -->
                <v-tab text="My messages" :value="3" v-if="myMessages.length"></v-tab>
            </v-tabs>

            <v-tabs-window v-model="tab">
                <v-tabs-window-item :value="1">
                    <div class="overflow-auto p-4 py-2">
                        <div
                            v-for="(chatter, i) in topChatters.slice(0, topChattersLength)"
                            :key="chatter.userName"
                            class="flex justify-between gap-2"
                            :class="{
                                // 'text-4xl': i === 0,
                                // 'text-3xl': i === 1,
                                // 'text-2xl': i === 2,
                            }"
                        >
                            <div class="shrink-0">
                                <span
                                    class="text-muted-more font-bold"
                                    :class="{
                                        // 'text-white': i === 0 || i === 1 || i === 2,
                                    }"
                                >
                                    #{{ i + 1 }}.
                                </span>
                                <span
                                    class="text-muted font-bold"
                                    :style="{
                                        // color: chatter.color,
                                        // textShadow: '0 0 5px ' + chatter.color,
                                    }"
                                >
                                    {{ chatter.userName }}
                                </span>
                            </div>

                            <div class="border-b-2 border-muted-more mb-[7px] border-dotted w-full"></div>

                            <span class="text-muted font-bold">{{ chatter.count }}</span>
                        </div>
                    </div>

                    <div class="bg-black-400 h-[1px]"></div>
                    <div v-if="myStats" class="flex justify-between p-4 py-3">
                        <div>
                            <span class="text-muted font-bold">#{{ myStats.rank }}. </span>
                            <span class="font-bold" :style="{ color: myStats.color }">{{ myStats.userName }}: </span>
                        </div>

                        <span class="text-muted font-bold">{{ myStats.count }}</span>
                    </div>
                    <div v-else class="px-4 py-2 text-muted text-sm italic">You haven't send any messages</div>
                </v-tabs-window-item>

                <v-tabs-window-item :value="2">
                    <div class="p-4">
                        <div v-for="(emote, i) in topEmotes" :key="emote.emote" class="flex items-center gap-4">
                            <div class="text-muted font-mono">{{ i + 1 }}</div>
                            <div>{{ emote.emote }}</div>
                            <div class="text-muted font-mono">{{ emote.count }}</div>
                        </div>
                    </div>
                </v-tabs-window-item>

                <v-tabs-window-item :value="3">
                    <div class="p-4 flex flex-col divide-y divide-black-600">
                        <div
                            v-for="message in myMessages"
                            :key="message.message_id"
                            class="flex gap-4 text-muted text-sm py-1.5 items-start"
                        >
                            <Message :message="message" :highlight="false" class="grow" />
                            <button
                                @click="videoStore.currentTime = message.offset_sec"
                                class="group relative rounded px-1 text-xs font-mono text-muted-more leading-tight pt-1"
                            >
                                <div
                                    class="absolute inset-0 bg-black-600 rounded-md scale-0 group-hover:scale-100 transition-all"
                                ></div>
                                <div class="relative">{{ formatTime(message.offset_sec) }}</div>
                            </button>
                        </div>
                    </div>
                </v-tabs-window-item>
            </v-tabs-window>
        </template>

        <div v-else class="p-4 text-muted">Loading...</div>
    </Widget>
</template>
