<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Section from './Section.vue';
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

async function getTopUsers() {
    const { data, error } = await supabase.rpc('get_top_chatters');

    if (error) {
        console.error(error);
        return;
    }

    topChatters.value = data;
    console.log(topChatters.value);
}

onMounted(async () => {
    await getTopUsers();
});
</script>

<template>
    <Section>
        <Container>
            <div class="flex justify-center pb-19">
                <div
                    class="leading-none inline-block uppercase text-8xl font-bold text-transparent bg-gradient-to-r from-secondary to-primary bg-clip-text"
                >
                    Statistics
                </div>
            </div>
            <div class="grid gap-8">
                <StatsNumber title="VODS" stat="965" class="vods" />
                <StatsNumber title="Hours" stat="2.625" class="hours" />
                <StatsNumber title="Chat Messages" stat="7.428.922" class="chat" />

                <StatCard class="chat-rank">
                    <div class="font-bold text-text-muted text-4xl">Most Active Chatters</div>
                    <div class="flex flex-col gap-2">
                        <div v-for="(chatter, i) in topChatters" :key="chatter.user_id">
                            <div
                                class="font-bold"
                                :class="i === 0 ? 'text-4xl' : i === 1 ? 'text-3xl' : i === 2 ? 'text-2xl' : ''"
                            >
                                #{{ i + 1 }} {{ chatter.user_name }}
                            </div>
                            <div class="font-bold text-gray-500">{{ chatter.message_count }}</div>
                        </div>
                    </div>
                </StatCard>
            </div>
        </Container>
    </Section>
</template>

<style scoped>
.grid {
    grid-template-areas:
        'vods   hours   chat-rank'
        'chat   chat    chat-rank';
}

.vods {
    grid-area: vods;
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
