<script setup lang="ts">
import HeaderAvatar from './HeaderAvatar.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { useVideosStore } from '../../videos/stores/videos.store';
import NavButton from './NavButton.vue';
import Search from '../../archive/components/Search.vue';

const authStore = useAuthStore();
const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
</script>

<template>
    <header class="z-header h-header via-black/70 via-60% to-black/0 fixed top-0 right-0 left-0 hidden lg:block">
        <div
            class="absolute inset-0 -bottom-8 pointer-events-none bg-linear-to-b bg-fred-300! from-black via-black/70 via-60% to-black/0 backdrop-blur-[1fpx] bfg-orange-400!"
        ></div>

        <Container width="100%" class="h-full">
            <div
                class="grid grid-cols-[1fr_auto] 3xl:grid-cols-[1fr_auto_1fr] h-full items-center justify-between gap-4"
            >
                <div class="flex h-full items-center gap-4">
                    <NavButton :to="{ name: 'home' }">
                        <img src="/images/m.svg" class="w-6" alt="" />
                    </NavButton>
                    <NavButton :to="{ name: 'streams' }">streams</NavButton>
                    <NavButton :to="{ name: 'playlists' }">playlists</NavButton>
                    <NavButton :to="{ name: 'games' }">games</NavButton>
                    <NavButton :to="{ name: 'about' }">about</NavButton>
                </div>

                <div class="hidden 3xl:block">
                    <Search class="w-110" />
                </div>

                <div class="flex items-center justify-end gap-4">
                    <div class="3xl:hidden">
                        <Search class="w-80 xl:w-90" />
                    </div>
                    <HeaderAvatar v-if="authStore.session" />
                    <SignInButton v-else class="w-auto!">Login with Twitch</SignInButton>
                </div>
            </div>
        </Container>
    </header>
</template>
