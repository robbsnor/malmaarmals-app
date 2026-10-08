<script setup lang="ts">
import { h, ref } from 'vue';
import { usePreferenceStore } from '../../shared/stores/preference.store';
import ResetButton from './ResetButton.vue';

const preferenceStore = usePreferenceStore();

const options = ref([1, 10, 50]);

const Badge = (props, { slots }) =>
    h(
        'button',
        {
            class: [
                ' p-1 border border-black-500 rounded-full hover:bg-primary-dark transition-all active:bg-primary flex-1 rounded',
                props.type,
            ],
        },
        slots.default?.()
    );
Badge.props = ['type'];
</script>

<template>
    <div class=" ">
        <Switch
            text="Overwrite chat width"
            description="Applies only in landscape-mode"
            v-model="preferenceStore.overwriteChatWidth"
        ></Switch>

        <div
            class="relative flex flex-col gap-4 scale-100 transition-all"
            :class="{ 'pointer-events-none scale-90f!': !preferenceStore.overwriteChatWidth }"
        >
            <div class="flex items-center gap-2">
                <v-number-input
                    v-model="preferenceStore.chatWidth"
                    :reverse="true"
                    controlVariant="hidden"
                    :inset="true"
                ></v-number-input>

                <div class="text-lgf text-muted">px</div>
            </div>

            <div class="flex justify-between flex-row gap-2 grow">
                <Badge
                    v-for="option in [...options].reverse()"
                    :key="option"
                    @click="preferenceStore.chatWidth -= option"
                >
                    -{{ option }}
                </Badge>
                <Badge v-for="option in options" :key="option" @click="preferenceStore.chatWidth += option">
                    +{{ option }}
                </Badge>
            </div>

            <div
                class="absolute inset-0 bg-linear-to-b from-black-200/60 to-black-200/80 z-10 opacity-0 transition-all pointer-events-none"
                :class="{
                    'opacity-100  ': !preferenceStore.overwriteChatWidth,
                }"
            ></div>
        </div>
    </div>
</template>
