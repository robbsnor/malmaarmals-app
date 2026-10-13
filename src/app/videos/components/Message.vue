<script setup lang="ts">
import { computed } from 'vue';
import type { Tables } from '../../shared/models/database.types';
import { emotesMap } from '../../shared/data/emotes.data';
import type { Message } from '../models/messages.model';
import { LEKKER_SPELEN_USER_ID, useAuthStore } from '../../auth/stores/auth.store';
import { TwitchHelper } from '../../shared/helpers/twitch.helper';

const props = withDefaults(
    defineProps<{
        message: Message;
        textHighlight?: boolean;
        subHighlight?: boolean;
        fontScale?: number;
        textShadow?: boolean;
    }>(),
    {
        textHighlight: true,
    }
);

const authStore = useAuthStore();

const isMyMessage = computed(
    () => props.message.user_id === Number(authStore.session.user?.user_metadata?.provider_id)
);
const isMention = computed(() =>
    props.message.text.includes(
        authStore.session.user?.user_metadata?.nickname || authStore.session.user?.user_metadata?.name
    )
);
const isLekkerSpelen = computed(() => props.message.user_id === LEKKER_SPELEN_USER_ID);
const isSub = computed(() => props.message.text.includes(`They've subscribed for`));
const isGifted = computed(() => props.message.text.includes(' gifted a '));
</script>

<template>
    <div class="text-sm">
        <div
            :class="{
                'bg-black-300 rounded-sm py-1 -mx-1 px-1 md:bg-black-600 2xl:-mx-2 2xl:px-2':
                    (props.textHighlight && isMyMessage) ||
                    (props.textHighlight && isMention) ||
                    (props.textHighlight && isLekkerSpelen),
                'bg-linear-to-r from-white/5 to-white/0 rounded-r p-2! border-l-primary border-l-2 rounded-l-none!':
                    props.subHighlight && (isSub || isGifted),
                'text-shadow-[0_0_4px] text-shadow-black': props.textShadow,
            }"
            :style="{ fontSize: props.fontScale ? `${props.fontScale}em` : '' }"
        >
            <img
                v-for="badge in props.message.badges"
                :key="badge.image_id"
                alt=""
                :src="TwitchHelper.getBadgeUrl(badge.image_id)"
                class="inline-block mr-[0.4em]! h-[1.4em] -mt-[2px]"
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
                <template v-if="isSub">
                    <template v-for="(sentence, i) in message.text.split('!')" :key="sentence">
                        <template v-if="i === 0"> {{ sentence }}! </template>
                        <b v-else>
                            <template v-for="word in sentence.split(' ')" :key="word">
                                <Emote v-if="word.startsWith(':emote')" :emoteString="word" />
                                <template v-else>{{ word }}</template>
                                {{ ' ' }}
                            </template>
                        </b>
                    </template>
                </template>

                <template v-else>
                    <template v-for="word in message.text.split(' ')" :key="word">
                        <Emote v-if="word.startsWith(':emote')" :emoteString="word" />
                        <b v-else-if="word.startsWith('@')">{{ word }}</b>
                        <a
                            v-else-if="word.startsWith('http') || word.startsWith('https')"
                            :href="word"
                            target="_blank"
                            class="link break-all"
                        >
                            {{ word }}
                        </a>
                        <template v-else>{{ word }}</template>
                        {{ ' ' }}
                    </template>
                </template>
            </span>
        </div>
    </div>
</template>
