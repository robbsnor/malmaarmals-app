<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../auth/stores/auth.store';
import Emote from '../shared/components/Emote.vue';
import { fetchAll } from '../shared/helpers/supabase-fetch-all.helper';
import { useStatsStore } from '../stats/stores/stats.store.ts';

const authStore = useAuthStore();
const statsStore = useStatsStore();

onMounted(async () => {});
</script>

<template>
    <div class="pt-4">
        <template v-for="message in statsStore.quotes">
            <RouterLink
                v-if="message.video_id"
                :to="{
                    name: 'stream',
                    params: { id: message.video_id },
                    query: { t: message.offset_sec - 30 },
                }"
                class="link block"
            >
                {{ message.text }}
            </RouterLink>
        </template>

        <!-- <div v-else class="flex flex-col gap-4">
            <Skeleton v-for="i in 10" :key="i" />
        </div> -->
    </div>
</template>
