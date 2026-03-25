<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        emoteString?: string;
        id?: number;
    }>(),
    {}
);

const imageError = ref(false);

const emote = computed(() => {
    const arr = props.emoteString.split(';');

    return {
        name: arr[1],
        id: arr[2],
    };
});

const emoteUrl = computed(() => {
    let emoteId: string | number = props.id;

    if (props.emoteString) {
        emoteId = emote.value.id;
    }

    const isTwitchNativeEmote = emoteId.toString().startsWith('55555');
    if (isTwitchNativeEmote) emoteId = null;

    return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/2.0`;
});

const handleImageError = () => {
    imageError.value = true;
};
</script>

<template>
    <img
        v-if="!imageError"
        :title="emote.name"
        :alt="emote.name"
        :src="emoteUrl"
        class="inline h-7"
        @error="handleImageError"
    />
    <div v-else class="inline h-7">
        {{ emote.name }}
    </div>
</template>
