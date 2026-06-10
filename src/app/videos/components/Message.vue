<script setup lang="ts">
import { computed } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { emotesMap } from '../../shared/data/emotes.data';
import type { Message } from '../models/messages.model';
import { LEKKER_SPELEN_USER_ID, useAuthStore } from '../../auth/stores/auth.store';

const props = withDefaults(
    defineProps<{
        message: Message;
        highlightOwnMessage?: boolean;
    }>(),
    {
        highlightOwnMessage: true,
    }
);

const authStore = useAuthStore();

const isMyMessage = computed(
    () => props.message.user_id === Number(authStore.session.user?.user_metadata?.provider_id)
);
const isLekkerSpelen = computed(() => props.message.user_id === LEKKER_SPELEN_USER_ID);
const isSub = computed(() => props.message.text.includes(`They've subscribed for`));
const isGifted = computed(() => props.message.text.includes(' gifted a '));
</script>

<template>
    <div
        :class="{
            'bg-black-300 rounded-sm py-1 -mx-1 px-1 md:bg-black-600 2xl:-mx-2 2xl:px-2':
                (isMyMessage && props.highlightOwnMessage) || isLekkerSpelen,
            'bg-gradient-to-r from-white/5 to-white/0 rounded-r p-2! border-l-primary border-l-2 rounded-l-none!':
                isSub || isGifted,
        }"
        class="text-sm"
    >
        <img
            v-for="badge in props.message.badges"
            :key="badge.image_id"
            alt=""
            :src="`https://static-cdn.jtvnw.net/badges/v1/${badge.image_id}/2`"
            class="inline-block mr-1 h-5"
        />

        <span
            :style="{
                color: message.user_color || '#2e8b57',
            }"
            class="font-bold"
            :data-user-id="message.user_id"
        >
            {{ message.user_name }}
        </span>

        <span class="break-words text-gray-300"
            >:
            <template v-for="word in message.text.split(' ')" :key="word">
                <Emote v-if="word.startsWith(':emote')" :emoteString="word" />
                <b v-else-if="word.startsWith('@')">{{ word }}</b>
                <a v-else-if="word.startsWith('http') || word.startsWith('https')" :href="word" target="_blank">
                    {{ word }}
                </a>
                <b v-else-if="isSub && word === 'months'">{{ word }}</b>
                <template v-else>{{ word }}</template>
                {{ ' ' }}
            </template>
        </span>
    </div>
</template>
