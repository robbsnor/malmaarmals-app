<script setup lang="ts">
import { useAppStore } from '../../shared/stores/app.store';
import Player from './Player.vue';
import Chat from './Chat.vue';
import { useVideoStore } from '../stores/video.store';
import { useAuthStore } from '../../auth/stores/auth.store';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <template v-if="authStore.isSubbed">
        <div
            v-if="videoStore.player.isActive"
            class="fixed bg-black z-100 flex flex-col md:flex-row"
            :class="
                videoStore.player.isMini
                    ? 'right-4 bottom-[100px] h-[120px] aspect-video rounded-md overflow-hidden border border-black-500 shadow-[0_0_20px_rgba(0,0,0,1)]'
                    : 'top-0 right-0 bottom-0 left-0'
            "
        >
            <div class="md:overflow-auto md:scroll-hidden">
                <Player />
                <!-- <Info /> -->
                <!-- <InfoLarge /> -->
            </div>

            <Chat v-if="!videoStore.player.isMini" class="shrink-0 w-full md:w-[250px]" />
        </div>
    </template>

    <div v-else class="fixed inset-0 z-100 flex flex-col gap-4 p-4 md:flex-row h-full bg-red-f200 bg-black">
        <div class="bg-black-200 rounded-md w-full aspect-video md:aspect-auto"></div>
        <div class="bg-black-200 rounded-md shrink-0 grow w-full md:w-[250px] md:grow-0"></div>

        <div class="absolute top-1/3 left-0 text-center p-8">
            <div class="bg-black-300 border border-black-500 rounded-md p-4">
                <div class="text-center pb-4">You are not subscribed. Subscribe to LekkerSpelen to start watching.</div>
                <v-btn
                    color="primary"
                    href="https://www.twitch.tv/lekkerspelen/"
                    target="_blank"
                    class="text-blue-500 underline"
                    >subscribe</v-btn
                >
            </div>
        </div>
    </div>
</template>
