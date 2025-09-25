<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/types/database.types';
import { emotesMap } from '../../shared/data/emotes.data';

const props = withDefaults(
    defineProps<{
        message?: Tables<'messages'>;
    }>(),
    {}
);

const isMyMessage = computed(() => {
    return (
        props.message.user_name === 'striddums' ||
        props.message.user_name === 'JuulWasBezet' ||
        props.message.user_name === 'Roekeloos' ||
        props.message.user_name === 'Robbsnor' ||
        props.message.user_name === 'Malmaarmal'
    );
});
</script>

<template>
    <li
        :class="{
            'bg-black-350 py-1 px-2 -mx-2 rounded-md': isMyMessage,
        }"
    >
        <span
            :style="{
                color: message.user_color || '#2e8b57',
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
                    class="underline text-primary-800 hover:text-primary-700"
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
</template>
