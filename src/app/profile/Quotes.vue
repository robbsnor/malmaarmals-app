<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../auth/stores/auth.store';
import Emote from '../shared/components/Emote.vue';
import { fetchAll } from '../shared/helpers/supabase-fetch-all.helper';

const authStore = useAuthStore();
const loading = ref(true);
const messages = ref([]);

onMounted(async () => {
    loading.value = true;

    const ors = ['-peter', '- peter'];
    try {
        const { data, error } = await fetchAll((from, to) =>
            supabase
                .from('messages')
                .select('text, video_id, offset_sec')
                .or(ors.map((phrase) => `text.ilike.%${phrase}%`).join(','))
                .order('date', { ascending: false })
                .range(from, to)
        );

        if (error) throw error;

        messages.value = data;
    } catch (err) {
        throw err;
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="flex gap-4 pt-4">
        <template v-if="!loading">
            <!-- <div
                v-for="(emote, i) in emotes.slice(0, amount)"
                :key="emote.id"
                class="relative overflow-hidden grow flex aspect-square items-center justify-center bg-black-300 rounded-md"
            >

            </div> -->
            <code>
                <pre>
                    {{ messages.map((m) => m.text) }}
                </pre>
            </code>
        </template>

        <template v-else class="flex gap-4">
            <Skeleton v-for="i in 5" :key="i" class="aspect-square grow h-auto" />
        </template>
    </div>
</template>
