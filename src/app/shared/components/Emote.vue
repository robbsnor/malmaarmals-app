<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        emoteString?: string;
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

const isNativeTwitchEmote = computed(() => emote.value.id.toString().startsWith('55555'));

const emoteUrl = computed(() => {
    if (isNativeTwitchEmote.value) return;

    let emoteId: string | number;

    if (props.emoteString) {
        emoteId = emote.value.id;
    }

    return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/2.0`;
});

const handleImageError = () => {
    imageError.value = true;
};
</script>

<template>
    <img
        v-if="!imageError && !isNativeTwitchEmote"
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
