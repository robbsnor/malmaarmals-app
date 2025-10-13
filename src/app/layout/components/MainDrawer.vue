<script setup lang="ts">
import { useAppStore } from '../../shared/stores/app.store';

const appStore = useAppStore();

const groups = [
    [
        { name: 'History', link: '/history', icon: 'mdi-history' },
        { name: 'Prefferences', link: '/settings', icon: 'mdi-cog' },
    ],
    [
        { name: 'Statistics', link: '/statistics', icon: 'mdi-chart-line' },
        { name: 'About', link: '/about', icon: 'mdi-information' },
        { name: 'Donate', link: '/donate', icon: 'mdi-heart' },
    ],
    [{ name: 'Sign out', link: '/sign-out', icon: 'mdi-logout' }],
];

const user = {
    name: 'Hoppsnor',
    avatar: 'https://static-cdn.jtvnw.net/jtv_user_pictures/e346d390-fe98-4c2a-baae-327288c8c55b-profile_image-300x300.png',
};
</script>

<template>
    <v-bottom-sheet v-model="appStore.mainDrawer" inset>
        <BottomSheetContainer>
            <div class="flex gap-4 items-center bg-black-400 mb-4 p-4 rounded-md bordfer border-black-400">
                <div v-if="true" class="rounded-full border-2 border-primary p-0.5">
                    <img :src="user.avatar" alt="Twitch Logo" class="h-10 rounded-full" />
                </div>
                <div>
                    <p class="text-lg font-bold">{{ user.name }}</p>
                    <p class="text-sm text-muted">
                        Subscribed for:
                        <span class="font-bold">2 months</span>
                    </p>
                </div>
                <div class="ml-auto">
                    <v-btn icon="mdi-logout" size="small" variant="tonal" color="error" />
                </div>
            </div>

            <div class="flex gap-4 flex-col">
                <div v-for="(group, index) in groups" :key="index">
                    <div class="flex flex-col gap-0.5">
                        <button
                            v-for="item in group"
                            :key="item.name"
                            @click="appStore.mainDrawer = false"
                            class="w-full text-left px-4 py-3 bg-black-400 hover:bg-black-600 text-normal transition flex gap-3 cursor-pointer items-center first:rounded-t-md last:rounded-b-md"
                            :class="item.name === 'Sign out' ? 'text-red-500' : ''"
                        >
                            <v-icon :icon="item.icon" size="16" />
                            {{ item.name }}
                        </button>
                    </div>
                </div>
            </div>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
