<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store.ts';
import { ArrayHelper } from '../../shared/helpers/array.helper.ts';
import Message from './Message.vue';
import ResetButton from './ResetButton.vue';
import { useAuthStore } from '../../auth/stores/auth.store.ts';

const preferenceStore = usePreferenceStore();
const authStore = useAuthStore();
const defaultFontScale = 1;
const fontScales = ref([0.8, defaultFontScale, 1.2, 1.4, 1.6]);
const labels = computed(() => fontScales.value.map((v) => `${v * 100}%`));
const selectedTick = ref(0);

function setFontScale(index: number) {
    preferenceStore.chatFontScale = fontScales.value[index];
}

function syncSelectedTick() {
    selectedTick.value = fontScales.value.findIndex((size) => size === preferenceStore.chatFontScale);
}

function reset() {
    preferenceStore.chatFontScale = defaultFontScale;
}

watch(
    () => preferenceStore.chatFontScale,
    () => syncSelectedTick(),
    { immediate: true }
);
</script>

<template>
    <div class="space-y-4">
        <div>
            <div class="flex items-center px-4 py-2 min-h-14 rounded-md bg-black-400 border border-black-500">
                <Message
                    :fontScale="preferenceStore.chatFontScale"
                    :message="{
                        message_id: 'foo',
                        offset_sec: 0,
                        // text: 'There\'s a Sicko in my boot! :emote;lekkerSicko;304445721;0;10:',
                        text: 'There\'s a Sicko in my boot!',
                        // user_color: 'var(--color-primary-dark)',
                        user_color: 'rgb(255, 105, 180)',
                        user_name: authStore.session.user.user_metadata.nickname,
                        user_id: 0,
                        badges: [],
                    }"
                ></Message>
            </div>
        </div>

        <div>
            <FormLabel class="-mb-3">Messages size</FormLabel>

            <v-slider
                thumb-size="12"
                v-model="selectedTick"
                track-size="4"
                density="compact"
                :max="fontScales.length - 1"
                color="primary"
                :ticks="ArrayHelper.arrayToIndexedObject(labels)"
                show-ticks="always"
                step="1"
                tick-size="4"
                @update:model-value="setFontScale"
            ></v-slider>
        </div>
    </div>
</template>

<style scoped>
:deep(.v-input) {
    margin-left: 2px;
    margin-right: 2px;
}
</style>
