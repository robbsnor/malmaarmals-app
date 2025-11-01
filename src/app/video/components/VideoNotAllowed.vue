<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideoStore } from '../stores/video.store';
import SignInButton from '../../shared/components/SignInButton.vue';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <div
        v-if="videoStore.player.isActive && !authStore.canWatch"
        class="flex flex-col gap-4 p-4 md:flex-row bg-red-20f0 h-available"
    >
        <div class="bg-black-200 rounded-md w-full aspect-video md:aspect-auto"></div>
        <div class="bg-black-200 rounded-md shrink-0 grow w-full md:w-[250px] md:grow-0"></div>

        <div class="absolute inset-0 p-8 flex items-center justify-center">
            <div class="bg-black-400 border border-black-500 rounded-md p-4">
                <template v-if="!authStore.session">
                    <div class="text-2xl font-bold">You are not logged in,</div>
                    <p class="text-muted">Log in with Twitch to start watching streams</p>
                    <SignInButton />
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
