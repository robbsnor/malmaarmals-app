<script setup lang="ts">
import { computed, onMounted, ref, watch, watchEffect, nextTick, useTemplateRef } from 'vue';
import { supabase } from '../../../supabase';
import { emotesMap } from '../../shared/data/emotes.data';

const props = withDefaults(
    defineProps<{
        videoTime: number;
        videoId: number;
    }>(),
    {}
);

const messages = ref<any[]>([]);
const chatRef = useTemplateRef<HTMLElement>('chatRef');

onMounted(async () => {
    await getMessages();
});

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

watchEffect(async () => {
    props.videoTime; // Depend on videoTime
    await nextTick();
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
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
</script>

<template>
    <ul
        v-if="messages"
        ref="chatRef"
        class="flex flex-col gap-1 p-4 md:pr-2 overflow-auto h-full w-full self-stretch scroll-hidden"
    >
        <li
            v-for="message in renderedMessages"
            :key="message.id"
            :class="{
                'bg-black-350 py-1 px-2 -mx-2 rounded-md':
                    message.user_name === 'striddums' ||
                    message.user_name === 'JuulWasBezet' ||
                    message.user_name === 'Roekeloos' ||
                    message.user_name === 'Malmaarmal',
            }"
        >
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
</template>
