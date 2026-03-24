<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(
    defineProps<{
        emoteString?: string;
        id?: number;
    }>(),
    {}
);

const emoteUrl = computed(() => {
    let emoteId: string | number = props.id;

    if (props.emoteString) {
        const str = props.emoteString.split('-');
        emoteId = str[1].split(';')[0];
    }

    return `https://static-cdn.jtvnw.net/emoticons/v2/${emoteId}/default/dark/1.0`;
});
</script>

<template>
    <img alt="emote" :src="emoteUrl" class="inline h-7" />
</template>
