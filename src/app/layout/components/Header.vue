<script setup lang="ts">
import HeaderAvatar from './HeaderAvatar.vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useArchiveStore } from '../../archive/stores/archive.store';
import { useVideosStore } from '../../video/stores/videos.store';
import NavButton from './NavButton.vue';
import { Z } from '../../shared/directives/z.directive';
import Search from './Search.vue';

const authStore = useAuthStore();
const archiveStore = useArchiveStore();
const videosStore = useVideosStore();
</script>

<template>
    <header
        v-z="Z.HEADER"
        class="h-header border-black-400 bg-black-100 fixed top-0 right-0 left-0 hidden border-b lg:block"
    >
        <Container width="100%" class="h-full">
            <div class="grid grid-cols-[1fr_auto_1fr] h-full items-center justify-between gap-4">
                <div class="flex h-full items-center gap-4">
                    <RouterLink :to="{ name: 'home' }">
                        <div class="hover:scale-102f transition-all">
                            <img src="/images/m.svg" class="w-6" alt="" />
                            <!-- <Logo class="w-45" :payoff="false" /> -->
                        </div>
                    </RouterLink>

                    <NavButton :to="{ name: 'home' }">home</NavButton>
                    <NavButton :to="{ name: 'archive' }">archive</NavButton>
                    <NavButton :to="{ name: 'about' }">about</NavButton>

                    <!-- <v-btn color="primary" variant="text" :to="{ name: 'home' }">home</v-btn>
                    <v-btn color="primary" variant="text" :to="{ name: 'archive' }">videos</v-btn>
                    <v-btn color="primary" variant="text" :to="{ name: 'about' }">about</v-btn> -->
                    <!-- <v-btn color="primary" variant="text" :to="{ name: 'archive', query: { type: 'playlists' } }">
                        playlists
                    </v-btn> -->
                </div>

                <div>
                    <Search class="hidden! xl:block! w-110!" />
                </div>

                <div class="flex items-center justify-end gap-4">
                    <div class="xl:hidden">
                        <Search class="w-80!" />
                    </div>
                    <HeaderAvatar v-if="authStore.session" />
                    <SignInButton v-else class="w-auto!">Login with Twitch</SignInButton>
                </div>
            </div>
        </Container>
    </header>
</template>

<style scoped>
.search :deep(.v-field) {
    /* border-radius: 12px;
    --v-field-border-width: 4px;
    --v-input-padding-top: 12px;  */
}
</style>
