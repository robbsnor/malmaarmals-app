<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideoStore } from '../stores/video.store';
import { randomNumber } from '../../shared/helpers/randomNumber';

const videoStore = useVideoStore();
const authStore = useAuthStore();
</script>

<template>
    <div
        v-if="videoStore.playerIsActive && !authStore.isSubbed"
        class="flex flex-col gap-4 p-2 md:flex-row w-full h-available bg-black-100"
    >
        <SkeletonContainer class="flex flex-col gap-3 w-full md:flex-row">
            <Skeleton :pulse="false" class="aspect-video w-full md:aspect-auto"></Skeleton>

            <div class="flex flex-col gap-3 md:w-[350px]">
                <div v-for="n in 40" :key="n">
                    <Skeleton
                        class="h-6"
                        :pulse="false"
                        :style="{
                            width: randomNumber(40, 100) + '%',
                        }"
                    ></Skeleton>
                </div>
            </div>
        </SkeletonContainer>

        <div class="absolute inset-0 p-8 flex items-center justify-center">
            <div class="bg-black-400 border border-black-500 rounded-md p-4">
                <template v-if="!authStore.session">
                    <div class="text-2xl font-bold">You are not logged in,</div>
                    <p class="text-muted">Log in with Twitch to start watching streams</p>
                    <SignInButton />
                </template>

                <template v-else>
                    <template v-if="!authStore.isSubbed">
                        <div class="text-2xl font-bold">You are not subscribed,</div>
                        <p class="text-muted">Subscribe to LekkerSpelen to start watching.</p>

                        <v-btn
                            color="primary"
                            href="https://www.twitch.tv/lekkerspelen/"
                            target="_blank"
                            class="w-full"
                            variant="tonal"
                        >
                            subscribe
                        </v-btn>
                    </template>
                </template>
            </div>
        </div>
    </div>
</template>
