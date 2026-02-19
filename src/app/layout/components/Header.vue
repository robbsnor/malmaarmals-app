<script setup lang="ts">
import HeaderAvatar from './HeaderAvatar.vue';
import Logo from '../../shared/components/Logo.vue';
import { useAuthStore } from '../../auth/stores/auth.store';

const authStore = useAuthStore();
</script>

<template>
    <header class="h-header border-black-400 bg-black-100 fixed top-0 right-0 left-0 hidden border-b 2xl:block">
        <Container width="100%" class="h-full">
            <div class="flex h-full items-center justify-between gap-4">
                <div class="flex h-full items-center gap-4">
                    <RouterLink :to="{ name: 'home' }">
                        <div class="hover:scale-102f transition-all">
                            <Logo class="w-45" :payoff="false" />
                        </div>
                    </RouterLink>

                    <v-btn color="primary" variant="text" :to="{ name: 'home' }">home</v-btn>
                    <v-btn color="primary" variant="text" :to="{ name: 'archive' }">video</v-btn>
                    <v-btn color="primary" variant="text" :to="{ name: 'archive', query: { type: 'playlists' } }">
                        playlists
                    </v-btn>
                    <v-btn color="primary" variant="text" :to="{ name: 'about' }">about</v-btn>
                </div>

                <div class="flex items-center gap-4">
                    <HeaderAvatar v-if="authStore.session" />
                    <SignInButton variant="flat" v-else class="w-auto!">Login with Twitch</SignInButton>
                </div>
            </div>
        </Container>
    </header>
</template>
