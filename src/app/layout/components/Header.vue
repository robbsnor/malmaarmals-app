<script setup lang="ts">
import HeaderAvatar from './HeaderAvatar.vue';
import Logo from '../../shared/components/Logo.vue';

const props = withDefaults(
    defineProps<{
        items?: string;
    }>(),
    {
        items: 'test',
    }
);
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
                </div>

                <div class="flex items-center gap-4">
                    <v-btn color="primary" variant="text" :to="{ name: 'history' }">history</v-btn>
                    <button class="flex items-center">
                        <span class="sr-only">Username</span>
                        <HeaderAvatar />
                    </button>
                </div>
            </div>
        </Container>
    </header>
</template>
