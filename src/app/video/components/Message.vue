<script setup lang="ts">
import { computed } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { emotesMap } from '../../shared/data/emotes.data';
import type { Message } from '../models/messages.model';
import { useAuthStore } from '../../auth/stores/auth.store';

const props = withDefaults(
    defineProps<{
        message: Message;
    }>(),
    {}
);
const authStore = useAuthStore();

const isMyMessage = computed(() => props.message.user_name === authStore.session.user?.user_metadata?.username);
</script>

<template>
    <li
        :class="{
            'bg-black-400 rounded-sm py-1 -mx-1 px-1': false, // isMyMessage
        }"
        class="text-sm"
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
                <a v-else-if="word.startsWith('http') || word.startsWith('https')" :href="word" target="_blank">
                    {{ word }}
                </a>
                <template v-else>{{ word }}</template>
                {{ ' ' }}
            </template>
        </span>
    </li>
</template>
