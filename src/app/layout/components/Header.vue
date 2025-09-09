<script setup lang="ts">
import { onKeyStroke, templateRef, useMagicKeys } from '@vueuse/core';
import { useAppStore } from '../../shared/stores/app.store';
import { useTemplateRef, watch } from 'vue';

const appStore = useAppStore();

const keys = useMagicKeys();
const searchRef = useTemplateRef<HTMLDivElement>('searchRef');

watch(keys['Meta+K'], () => searchRef.value.focus());
</script>

<template>
    <div ref="header" class="top-0 right-0 left-0 z-100 bg-black/80 fixed backdrop-blur-md">
        <Container>
            <div class="grid h-(--header-height) py-2 gap-4" style="grid-template-columns: 1fr auto 1fr">
                <div class="flex items-center gap-8">
                    <RouterLink to="/" class="flex flex-col gap-[2px]">
                        <div class="text-2xl leading-[1] font-bold uppercase">malmaarmals</div>
                        <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                    </RouterLink>

                    <div class="flex items-center gap-2">
                        <v-btn to="/">Home</v-btn>
                        <v-btn to="/videos">Videos</v-btn>
                        <v-btn to="/about">About</v-btn>
                    </div>
                </div>

                <v-text-field
                    ref="searchRef"
                    v-model="appStore.query"
                    class="w-100"
                    hide-details
                    append-inner-icon="mdi-magnify"
                    placeholder="Search..."
                ></v-text-field>
                <!-- <UInput trailing-icon="i-lucide-search" size="lg" /> -->

                <div class="flex items-center justify-end">
                    <v-btn class="mr-2" append-icon="mdi-twitch" color="secondary"> Login with Twitch </v-btn>
                </div>
            </div>
        </Container>
    </div>
</template>
