<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import { useVideoStore } from '../stores/video.store';
import { randomNumber } from '../../shared/helpers/randomNumber';

const videoStore = useVideoStore();
const authStore = useAuthStore();

function refresh() {
    window.location.reload();
}
</script>

<template>
    <div
        v-if="videoStore.playerIsActive && !authStore.isSubbed"
        class="flex flex-col gap-4 p-4 md:flex-row w-full h-available bg-black-100 overflow-hidden"
    >
        <div class="flex flex-col gap-4 w-full md:flex-row">
            <Skeleton :pulse="false" class="aspect-video w-full md:aspect-auto"></Skeleton>

            <div class="flex flex-col gap-3 md:w-[350px] overflow-hidden rounded-md">
                <div v-for="n in 50" :key="n">
                    <Skeleton
                        class="h-6"
                        :pulse="false"
                        :style="{
                            width: randomNumber(40, 100) + '%',
                        }"
                    ></Skeleton>
                </div>
            </div>
        </div>

        <div class="absolute inset-0 p-8 flex items-center justify-center">
            <Alert
                v-if="!authStore.session"
                title="You are not logged in"
                description="Log in with Twitch to start watching streams."
            >
                <SignInButton>Login with Twitch</SignInButton>
            </Alert>

            <template v-else>
                <Alert
                    v-if="!authStore.isSubbed"
                    title="You are not subscribed to LekkerSpelen."
                    description="Please subscribe to the malse males to watch streams"
                >
                    <div class="flex flex-col gap-2">
                        <v-btn
                            color="primary"
                            href="https://www.twitch.tv/lekkerspelen/"
                            target="_blank"
                            class="w-full"
                            variant="tonal"
                            append-icon="mdi-open-in-new"
                        >
                            subscribe
                        </v-btn>
                        <v-btn color="primary" variant="text" @click="refresh()">refresh</v-btn>
                    </div>
                </Alert>
            </template>
        </div>
    </div>
</template>
