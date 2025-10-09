<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Tables } from '../../shared/types/database.types';
import { emotesMap } from '../../shared/data/emotes.data';
import { TimeHelper } from '../../shared/helpers/time.helper';

const props = withDefaults(
    defineProps<{
        message?: Tables<'messages'>;
    }>(),
    {}
);

const isMyMessage = computed(() => {
    return (
        // props.message.user_name === 'striddums' ||
        // props.message.user_name === 'JuulWasBezet' ||
        // props.message.user_name === 'Roekeloos' ||
        // props.message.user_name === 'Malmaarmal' ||
        props.message.user_name === 'Robbsnor'
    );
});
</script>

<template>
    <li
        :class="{
            'bg-african-violet-400-400 py-1 px-2 -mx-2 rounded-md': isMyMessage,
        }"
        class="text-sm"
        :data-id="message.id"
    >
        <!-- <span class="text-black-1800 text-xs mr-2"> {{ TimeHelper.formatTime(message.offset_sec) }} </span> -->
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
                <a v-else-if="word.startsWith('http') || word.startsWith('https')" :href="word" target="_blank">
                    {{ word }}
                </a>
                <template v-else>{{ word }}</template>
                {{ ' ' }}
            </template>
        </span>
    </li>
</template>
