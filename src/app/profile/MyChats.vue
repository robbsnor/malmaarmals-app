<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../auth/stores/auth.store';
import Emote from '../shared/components/Emote.vue';
import { fetchAll } from '../shared/helpers/supabase-fetch-all.helper';

const authStore = useAuthStore();
const amount = ref(5);
const messages = ref<string[]>([]);
const loading = ref(true);

const emotes = computed(() => {
    const list = new Map<string, { count: number; name: string; id: string; string: string }>();

    messages.value.forEach((message) => {
        const emotes = message.split(' ').filter((word) => word.startsWith(':emote;lekker'));

        emotes.forEach((emote) => {
            const arr = emote.split(';');
            const name = arr[1];
            const id = arr[2];

            const existingEmote = list.get(name);

            if (existingEmote) {
                existingEmote.count++;
            } else {
                list.set(name, {
                    count: 1,
                    name: name,
                    id: id,
                    string: emote,
                });
            }
        });
    });

    return [...list.values()].sort((a, b) => b.count - a.count);
});

onMounted(async () => {
    loading.value = true;

    try {
        const { data, error } = await fetchAll((from, to) =>
            supabase
                .from('messages')
                .select('text')
                .ilike('text', '%:emote;lekker%')
                .eq('user_id', Number(authStore.session.user.user_metadata.provider_id))
                .order('date', { ascending: false })
                .range(from, to)
        );

        if (error) throw error;

        messages.value = data.map((d) => d.text);
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
            <div
                v-for="(emote, i) in emotes.slice(0, amount)"
                :key="emote.id"
                class="relative overflow-hidden grow flex aspect-square items-center justify-center bg-black-300 rounded-md"
            >
                <div class="absolute text-[8rem] font-bold opacity-10 text-muted">#{{ i + 1 }}</div>
                <div class="absolute inset-0 bg-linear-to-r from-black-300/90 to-black-300/20"></div>
                <div class="relative flex flex-col items-center justify-center gap-0.5">
                    <Emote :emote-string="emote.string" class="h-14"></Emote>
                    <div class="text-muted text-sm">
                        {{ emote.count }}
                    </div>
                </div>
            </div>
        </template>

        <template v-else class="flex gap-4">
            <Skeleton v-for="i in amount" :key="i" class="aspect-square grow h-auto" />
        </template>
    </div>
</template>
