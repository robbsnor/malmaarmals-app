<script setup lang="ts">
import { useAppStore } from '../../shared/stores/app.store';

const appStore = useAppStore();
</script>

<template>
    <div ref="header" class="top-0 right-0 left-0 z-100 bg-black/80 fixed backdrop-blur-md">
        <Container>
            <div class="grid h-(--header-height) py-2" style="grid-template-columns: 1fr auto 1fr">
                <div class="flex items-center gap-8">
                    <RouterLink to="/" class="flex flex-col gap-[2px]">
                        <div class="text-2xl leading-[1] font-bold uppercase">malmaarmals</div>
                        <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                    </RouterLink>

                    <div class="flex items-center gap-2">
                        <UButton variant="soft" to="/">Home</UButton>
                        <UButton variant="soft" to="/videos">Videos</UButton>
                        <UButton variant="soft" to="/about">About</UButton>
                    </div>
                </div>

                <UInput v-model="appStore.searchQuery" />

                <div class="flex items-center justify-end">
                    <UButton class="mr-2" color="secondary" trailing-icon="i-lucide-twitch">
                        Login with Twitch
                    </UButton>
                </div>
            </div>
        </Container>
    </div>
</template>
