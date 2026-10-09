<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../supabase';
import { useAuthStore } from '../auth/stores/auth.store';
import Emote from '../shared/components/Emote.vue';
import { fetchAll } from '../shared/helpers/supabase-fetch-all.helper';

const authStore = useAuthStore();
const messages = ref<string[]>([]);

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

    const foo = [...list.values()].sort((a, b) => b.count - a.count);
    console.log(foo);
    return foo;
});

onMounted(async () => {
    const { data, error } = await fetchAll((from, to) =>
        supabase
            .from('messages')
            .select('text')
            .ilike('text', '%:emote;lekker%')
            .eq('user_id', Number(authStore.session.user.user_metadata.provider_id))
            .range(from, to)
    );

    if (error) return console.log(error);

    messages.value = data.map((d) => d.text);
});
</script>

<template>
    <div class="flex flex-wrap gap-4 py-4">
        <div
            v-for="(emote, i) in emotes.slice(0, 5)"
            :key="emote.id"
            class="relative overflow-hidden w-30 flex aspect-square items-center justify-center bg-black-300 rounded-md"
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
    </div>
</template>
