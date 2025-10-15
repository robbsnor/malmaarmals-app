<script setup lang="ts">
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useAppStore } from '../../shared/stores/app.store';
import { useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';

const appStore = useAppStore();
const authStore = useAuthStore();

const groups = computed(() => {
    const isSignedIn = !!authStore.session;
    console.log(isSignedIn);

    return [
        [
            { name: 'History', icon: 'mdi-history' },
            { name: 'Prefferences', icon: 'mdi-cog' },
        ],
        [
            { name: 'Statistics', icon: 'mdi-chart-line' },
            { name: 'About', to: '/about', icon: 'mdi-information' },
            { name: 'Donate', icon: 'mdi-heart' },
        ],
        [{ name: 'Sign out', link: '/sign-out', icon: 'mdi-logout', hidden: !isSignedIn, action: 'sign-out' }],
    ] as any;
});

const handleClick = async (item: any) => {
    if (item?.action === 'sign-out') {
        await authStore.signOut();
    }

    appStore.mainDrawer = false;
};
</script>

<template>
    <v-bottom-sheet v-model="appStore.mainDrawer" inset eager>
        <BottomSheetContainer>
            <div
                v-if="authStore.session"
                class="flex gap-4 items-center bg-black-400 mb-4 p-4 rounded-md bordfer border-black-400"
            >
                <div class="rounded-full border-2 border-primary p-0.5">
                    <img
                        :src="authStore.session.user.user_metadata.avatar_url"
                        alt="Twitch Logo"
                        class="h-10 rounded-full"
                    />
                </div>
                <div>
                    <p class="text-lg font-bold">{{ authStore.session.user.user_metadata.nickname }}</p>
                    <p class="text-sm text-muted"><span class="font-bold">82 Months</span> subscribed!</p>
                </div>
            </div>

            <div class="flex gap-4 flex-col">
                <div v-for="(group, index) in groups" :key="index">
                    <div class="flex flex-col gap-0.5">
                        <template v-for="item in group" :key="item.name">
                            <Component
                                :is="item.to ? RouterLink : 'button'"
                                :to="item.to"
                                v-if="!item.hidden"
                                @click="handleClick(item)"
                                class="w-full text-left px-4 py-3 bg-black-400 hover:bg-black-600 text-normal transition flex gap-3 cursor-pointer items-center first:rounded-t-md last:rounded-b-md"
                                :class="item.icon === 'mdi-logout' ? 'text-red-500' : ''"
                            >
                                <v-icon :icon="item.icon" size="16" />
                                {{ item.name }}
                            </Component>
                        </template>
                    </div>
                </div>
            </div>
        </BottomSheetContainer>
    </v-bottom-sheet>
</template>
