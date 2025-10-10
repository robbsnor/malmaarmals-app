<script setup lang="ts">
import { useElementSize, useMagicKeys } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideosStore } from '../../videos/stores/videos.store';

const appStore = useAppStore();
const videosStore = useVideosStore();
const keys = useMagicKeys();
const headerRef = useTemplateRef<HTMLDivElement>('headerRef');
const loggedIn = ref(true);

watch(keys['Meta+K'], () => videosStore.goToVideosPage());
</script>

<template>
    <div
        v-if="appStore.headerShown"
        ref="headerRef"
        class="top-0 right-0 left-0 z-100 bg-black fixed transition-transform border-b border-black-500"
        :class="{ 'translate-y-[-100%]': !appStore.headerShown }"
    >
        <Container>
            <div class="flex items-center justify-between h-[var(--height-header)]">
                <RouterLink to="/" class="flex flex-col gap-[2px]">
                    <div class="text-2xl leading-[1] font-bold uppercase">MalMaarMals</div>
                    <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                </RouterLink>

                <div v-if="loggedIn" class="rounded-full border-2 border-primary p-0.5">
                    <img
                        src="https://static-cdn.jtvnw.net/jtv_user_pictures/e346d390-fe98-4c2a-baae-327288c8c55b-profile_image-300x300.png"
                        alt="Twitch Logo"
                        class="h-8 rounded-full"
                    />
                </div>

                <v-btn v-else append-icon="mdi-twitch" color="primary">Login</v-btn>
            </div>
        </Container>
    </div>
</template>
