<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';

const props = withDefaults(
    defineProps<{
        videoTime: number;
        videoId: number;
    }>(),
    {}
);

const messages = ref<any[]>([]);
const renderedMessages = computed(() => {
    // Find the index of the last message within videoTime using binary search
    let left = 0;
    let right = messages.value.length - 1;
    let idx = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (messages.value[mid].offset_sec <= props.videoTime) {
            idx = mid;
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    if (idx === -1) return [];

    // Return up to 400 messages ending at idx
    const start = Math.max(0, idx - 399);
    return messages.value.slice(start, idx + 1);
});

onMounted(async () => {
    await getMessages();
});

const getMessages = async () => {
    let from = 0;
    let to = 999;
    let hasMore = true;

    while (hasMore) {
        const { data, error, count } = await supabase
            .from('messages')
            .select('user_login,user_name,user_color,text,offset_sec,id', {
                count: 'exact',
            })
            .eq('video_id', Number(props.videoId))
            .order('offset_sec', { ascending: true })
            .range(from, to);

        if (error) {
            return console.error('Error fetching messages:', error);
        }

        if (data && data.length > 0) {
            messages.value = [...messages.value, ...data];
            from += 1000;
            to += 1000;
            hasMore = data.length === 1000;
        } else {
            hasMore = false;
        }
    }
};

const emotesMap = {
    lekkerTrex: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_860aee8396ed426cb2f7827de1b1c8c1/default/dark/2.0',
    lekkerSnoek: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4ff4f5f326734c3e8a75a3dfc0ecaaa9/default/dark/2.0',
    lekkerNou: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_2dfb8bfede6848cea6e50ed9d67bd290/default/dark/2.0',
    lekkerLeft: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_a99bcec162f4427daee6cc01121c2ae1/default/dark/2.0',
    lekkerUp: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_8c0e6b2646ca4bdabc08d3f00d0a94c1/default/dark/2.0',
    lekkerRight: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_2d12363c865c45508340adc67e963a51/default/dark/2.0',
    lekkerSicko: 'https://static-cdn.jtvnw.net/emoticons/v2/304445721/default/dark/2.0',
    lekkerRichard: 'https://static-cdn.jtvnw.net/emoticons/v2/886250/default/dark/2.0',
    lekkerRanzig: 'https://static-cdn.jtvnw.net/emoticons/v2/981667/default/dark/2.0',
    lekkerPijnlijk: 'https://static-cdn.jtvnw.net/emoticons/v2/300027601/default/dark/2.0',
    lekkerBalen: 'https://static-cdn.jtvnw.net/emoticons/v2/300025998/default/dark/2.0',
    lekkerCringe: 'https://static-cdn.jtvnw.net/emoticons/v2/300916929/default/dark/2.0',
    lekkerKoppie: 'https://static-cdn.jtvnw.net/emoticons/v2/717472/default/dark/2.0',
    lekkerChill: 'https://static-cdn.jtvnw.net/emoticons/v2/1331458/default/dark/2.0',
    lekkerSpugen: 'https://static-cdn.jtvnw.net/emoticons/v2/401890/default/dark/2.0',
    lekkerRochel: 'https://static-cdn.jtvnw.net/emoticons/v2/401911/default/dark/2.0',
    lekkerGerdie: 'https://static-cdn.jtvnw.net/emoticons/v2/300025632/default/dark/2.0',
    lekkerLikken: 'https://static-cdn.jtvnw.net/emoticons/v2/181836/default/dark/2.0',
    lekkerHalt: 'https://static-cdn.jtvnw.net/emoticons/v2/301208727/default/dark/2.0',
    lekkerDeal: 'https://static-cdn.jtvnw.net/emoticons/v2/722774/default/dark/2.0',
    lekkerKonkie: 'https://static-cdn.jtvnw.net/emoticons/v2/325362/default/dark/2.0',
    lekkerXD: 'https://static-cdn.jtvnw.net/emoticons/v2/320048/default/dark/2.0',
    lekkerDjensen: 'https://static-cdn.jtvnw.net/emoticons/v2/716055/default/dark/2.0',
    lekkerGier: 'https://static-cdn.jtvnw.net/emoticons/v2/242732/default/dark/2.0',
    lekkerZuur: 'https://static-cdn.jtvnw.net/emoticons/v2/300828337/default/dark/2.0',
    lekkerUSA: 'https://static-cdn.jtvnw.net/emoticons/v2/301905820/default/dark/2.0',
    lekkerOncto: 'https://static-cdn.jtvnw.net/emoticons/v2/300833689/default/dark/2.0',
    lekkerDag: 'https://static-cdn.jtvnw.net/emoticons/v2/300644885/default/dark/2.0',
    lekkerWhat: 'https://static-cdn.jtvnw.net/emoticons/v2/300636862/default/dark/2.0',
    lekkerOh: 'https://static-cdn.jtvnw.net/emoticons/v2/839127/default/dark/2.0',
    lekkerLief: 'https://static-cdn.jtvnw.net/emoticons/v2/717918/default/dark/2.0',
    lekkerGestuurd: 'https://static-cdn.jtvnw.net/emoticons/v2/301905866/default/dark/2.0',
    lekkerAppie: 'https://static-cdn.jtvnw.net/emoticons/v2/205377/default/dark/2.0',
    lekkerJa: 'https://static-cdn.jtvnw.net/emoticons/v2/839226/default/dark/2.0',
    lekkerNee: 'https://static-cdn.jtvnw.net/emoticons/v2/68021/default/dark/2.0',
    lekkerAanval:
        'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_6a6d149791c447b8bf4046109fa34bb1/default/dark/2.0',
    lekkerWoef: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9cda427420044c858e0f107d2410629e/default/dark/2.0',
    lekkerSlijm: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_626302e581c24a2cb90c2ac193ae39e6/default/dark/2.0',
    lekkerDD: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_4b84c5e2a2534783a0078f7dc42ce5ec/default/dark/2.0',
    lekkerActually:
        'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9788bc4a2ab24c57bd6f2c4a08ed7d24/default/dark/2.0',
    lekkerZwoel: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_9da099e2f7c14cf4868bd06ef48c3bb3/default/dark/2.0',
    lekkerSceptist:
        'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_e1b4991dd5cb4cd58c5e52e74f75c198/default/dark/2.0',
    lekkerWtf: 'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_89aadf7d0c904e119ead7d06a65f999c/default/dark/2.0',
    lekkerHeftig:
        'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_b556f5f4cd2244c5a9794bc8c533e8f3/default/dark/2.0',
    lekkerRobson:
        'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_d39724a20ea74561a3f4a1e3bfb90a17/default/dark/2.0',

    lekkerHoor: 'https://static-cdn.jtvnw.net/emoticons/v2/178075/default/dark/2.0',
};
</script>

<template>
    <div v-if="messages" class="flex h-full flex-col-reverse overflow-y-auto rounded-md bg-pink-500a p-2">
        <ul class="flex flex-col gap-1">
            <li v-for="message in renderedMessages" :key="message.id">
                <!-- {{ message.offset_sec }}s -->
                <span
                    :style="{
                        color: message.user_color ? message.user_color : '#2e8b57',
                    }"
                    class="font-bold"
                >
                    {{ message.user_name }}
                </span>

                <span class="break-words text-gray-300"
                    >:
                    <template v-for="word in message.text.split(' ')" :key="word">
                        <img v-if="emotesMap[word]" alt="emote" :src="emotesMap[word]" class="inline h-7" />
                        <b v-else-if="word.startsWith('@')">{{ word }}</b>
                        <a
                            class="underline text-primary-lighter hover:text-primary-light"
                            v-else-if="word.startsWith('http') || word.startsWith('https')"
                            :href="word"
                            target="_blank"
                        >
                            {{ word }}
                        </a>
                        <template v-else>{{ word }}</template>
                        {{ ' ' }}
                    </template>
                </span>
            </li>
        </ul>
    </div>
</template>
