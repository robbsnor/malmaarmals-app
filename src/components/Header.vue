<script setup lang="ts">
import Search from './Search.vue';
import { supabase } from '../supabase';

const toggleFullscreen = () => {
    // if (!document.fullscreenElement) {
    //     document.documentElement.requestFullscreen();
    // } else {
    //     document.exitFullscreen();
    // }
};
</script>

<template>
    <div ref="header" class="top-0 right-0 left-0 z-100 bg-black/75 px-4">
        <div class="grid h-(--header-height) py-2 backdrop-blur-2xl" style="grid-template-columns: 1fr auto 1fr">
            <div class="flex items-center gap-8">
                <RouterLink to="/" class="flex flex-col gap-[2px]">
                    <div class="text-2xl leading-[1] font-black uppercase">malmaarmals</div>
                    <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                </RouterLink>

                <div class="flex items-center gap-2">
                    <RouterLink variant="soft" size="xl" to="/">Home</RouterLink>
                    <RouterLink variant="soft" size="xl" to="/videos"> Videos </RouterLink>
                </div>
            </div>

            <Search />

            <div class="flex items-center justify-end">
                <div @click="toggleFullscreen" class="mr-2">log in or something</div>
            </div>
        </div>
    </div>
</template>
