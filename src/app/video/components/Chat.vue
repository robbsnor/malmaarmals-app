<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watchEffect } from 'vue';
import { supabase } from '../../../supabase';
import type { Tables } from '../../shared/types/database.types';
import Message from './Message.vue';

const props = withDefaults(
    defineProps<{
        videoTime: number;
        videoId: number;
    }>(),
    {}
);

const messages = ref<Tables<'messages'>[]>([]);
const isFetchingMessages = ref(true);
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

const subCount = computed(() => messages.value.filter((m) => m.text.includes('subscribed')).length);

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
            isFetchingMessages.value = false;
            return console.error('Error fetching messages:', error);
        }

        if (data && data.length > 0) {
            // @ts-ignore
            messages.value = [...messages.value, ...data];
            from += 1000;
            to += 1000;
            hasMore = data.length === 1000;
        } else {
            hasMore = false;
        }
    }

    isFetchingMessages.value = false;
};

watchEffect(async () => {
    props.videoTime; // Depend on videoTime
    await nextTick();
    chatRef.value.scrollTop = chatRef.value.scrollHeight;
});
</script>

<template>
    <ul
        v-if="messages"
        ref="chatRef"
        class="flex flex-col gap-1 p-4 overflow-y-auto overflow-x-hidden h-full w-full self-stretch scroll-hidden md:pr-2 lg:p-4"
    >
        <Message v-for="message in renderedMessages" :key="message.id" :message="message" />
    </ul>
</template>
