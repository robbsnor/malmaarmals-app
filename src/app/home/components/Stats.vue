<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';
import StatCard from './StatCard.vue';
import StatsNumber from './StatsNumber.vue';

const props = withDefaults(
    defineProps<{
        items?: string;
    }>(),
    {
        items: 'test',
    }
);

const topChatters = ref<
    {
        message_count: number;
        user_id: number;
        user_name: string;
    }[]
>([]);

// Background position state for animation
const bgPosition = ref(-19);

async function getTopUsers() {
    const { data, error } = await supabase.rpc('get_top_chatters');

    if (error) {
        console.error(error);
        return;
    }

    topChatters.value = data;
}

onMounted(async () => {
    await getTopUsers();

    // Animate background position every 100ms
    setInterval(() => {
        bgPosition.value += 1;
    }, 100);
});
</script>

<template>
    <Section :show-top-fade="true">
        <!-- <template #background>
            <div
                class="absolute inset-0"
                :style="`
                        background-image: radial-gradient(var(--color-primary) 10px, transparent 0);
                        background-size: 60px 60px;
                        background-position: ${bgPosition}px ${bgPosition}px;
                    `"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-b from-black/100 to-black/80 backdrop-blur-xs"></div>
        </template> -->

        <div class="flex justify-center pb-19">
            <GradientText text="Statistics" />
        </div>

        <div class="grid-main grid gap-8">
            <StatsNumber title="Streams" stat="965" class="streams" />
            <StatsNumber title="Hours" stat="2.625" class="hours" />
            <StatsNumber title="Chat Messages" stat="7.428.922" class="chat" />

            <StatCard class="chat-rank">
                <div class="p-8">
                    <div class="font-bold text-text-muted text-4xl pb-4">Most Active Chatters</div>

                    <div class="flex flex-col gap-2">
                        <div v-for="(chatter, i) in topChatters" :key="chatter.user_id" class="flex gap-2 items-end">
                            <div
                                class="font-bold"
                                :class="i === 0 ? 'text-4xl' : i === 1 ? 'text-3xl' : i === 2 ? 'text-2xl' : ''"
                            >
                                #{{ i + 1 }} {{ chatter.user_name }}
                            </div>
                            <div class="font-bold text-gray-500">{{ chatter.message_count }}</div>
                        </div>
                    </div>
                </div>
            </StatCard>
        </div>
    </Section>
</template>

<style scoped>
.grid-main {
    /* grid-template-columns: repeat(3, 1fr); */
    grid-template-areas:
        'streams   hours   chat-rank'
        'chat      chat    chat-rank';
}

.streams {
    grid-area: streams;
}

.hours {
    grid-area: hours;
}

.chat {
    grid-area: chat;
}

.chat-rank {
    grid-area: chat-rank;
}
</style>
