<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideoStore } from '../stores/video.store';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <div
        v-if="videoStore.player.isActive && (!authStore.isSubbed || !authStore.session)"
        class="fixed top-0 right-0 bottom-mobile-navbar left-0 z-100 flex flex-col gap-4 p-4 md:flex-row bg-red-200f"
    >
        <div class="bg-black-200 rounded-md w-full aspect-video md:aspect-auto"></div>
        <div class="bg-black-200 rounded-md shrink-0 grow w-full md:w-[250px] md:grow-0"></div>

        <div class="absolute top-1/3 left-0 text-center p-8">
            <div class="bg-black-400 border border-black-500 rounded-md p-4">
                <template v-if="!authStore.session">
                    <div>You are not logged in. Please log in to start watching.</div>

                    <v-btn
                        color="primary"
                        variant="tonal"
                        prepend-icon="mdi-twitch"
                        @click="authStore.signIn()"
                        class="w-full mt-4"
                    >
                        Login
                    </v-btn>
                </template>

                <template v-else>
                    <template v-if="!authStore.isSubbed">
                        <div>You are not subscribed. Subscribe to LekkerSpelen to start watching.</div>

                        <v-btn class="mt-4" color="primary" href="https://www.twitch.tv/lekkerspelen/" target="_blank">
                            subscribe
                        </v-btn>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
