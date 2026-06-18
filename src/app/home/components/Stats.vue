<script setup lang="ts">
import { computed } from 'vue';
import { useStatsStore } from '../../stats/stores/stats.store';
import { useAuthStore } from '../../auth/stores/auth.store';
import Flower from './Flower.vue';

const statStore = useStatsStore();
const authStore = useAuthStore();

const topUsers = computed(() => {
    const users = statStore.chatStats.top_users.slice(0, 3);
    return [users[1], users[0], users[2]];
});
</script>

<template>
    <!-- v-if="authStore.isAdmin" -->
    <Section title="Top chatters">
        <template v-if="!statStore.chatStatsLoading">
            <div class="flex gap-4 justify-between items-end">
                <div
                    v-for="(user, i) in topUsers"
                    :key="user.user_id"
                    class="rounded-t-xl p-4 pt-10 relative overflow-hidden w-full"
                    :class="{
                        'pb-40': i === 0,
                        'pb-60': i === 1,
                        'pb-20': i === 2,
                    }"
                >
                    <div
                        class="absolute w-[150%] bottom-0 left-1/2 -translate-x-1/2 opacity-10"
                        :class="{
                            'text-[#C0C0C0]': i === 0,
                            'text-[#FFD700]': i === 1,
                            'text-[#CD7F32]': i === 2,
                        }"
                    >
                        <Flower />
                    </div>

                    <div class="bg-gradient-to-b from-black-400 to-black/0 absolute inset-0"></div>

                    <div class="relative">
                        <div class="text-center text-4xl font-bold uppercase">
                            {{ user.user_name }}
                        </div>
                        <div class="text-center text-2xl pt-4 text-muted font-bold uppercase">
                            {{ user.message_count.toLocaleString('nl-NL') }}
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="false" class="grid grid-cols-[0fr_1fr_0fr] gap-x-4 gap-y-2">
                <template v-for="(user, i) in statStore.chatStats.top_users" :key="user.user_id">
                    <div class="text-right font-mono">{{ i }}</div>
                    <div>
                        {{ user.user_name }}
                    </div>

                    <div class="ml-auto font-mono">{{ user.message_count.toLocaleString('nl-NL') }}</div>
                </template>
            </div>
        </template>
    </Section>
</template>
