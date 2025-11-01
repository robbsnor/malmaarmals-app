<script setup lang="ts">
import { supabase } from '../../../supabase';
import { useAuthStore } from '../../auth/stores/auth.store';
import { useAppStore } from '../../shared/stores/app.store';
import { useRouter, RouterLink } from 'vue-router';
import { computed } from 'vue';
import SignInButton from '../../shared/components/SignInButton.vue';

const appStore = useAppStore();
const authStore = useAuthStore();

const groups = computed(() => {
    const isSignedIn = !!authStore.session;

    return [
        [
            { name: 'History', icon: 'mdi-history', hidden: !isSignedIn, disabled: true },
            { name: 'Prefferences', icon: 'mdi-cog', hidden: !isSignedIn, disabled: true },
        ],
        [
            { name: 'Statistics', icon: 'mdi-chart-line', disabled: true },
            { name: 'About', to: '/about', icon: 'mdi-information' },
            // { name: 'Donate', icon: 'mdi-heart', hidden: !isSignedIn, disabled: true },
        ],
        [{ name: 'Sign out', link: '/sign-out', icon: 'mdi-logout', hidden: !isSignedIn, action: 'sign-out' }],
    ].filter((group) => group.some((item) => !item.hidden)) as any;
});

const handleClick = async (item: any) => {
    if (item.disabled) return;

    if (item.action === 'sign-out') {
        await authStore.signOut();
    }

    appStore.mainDrawer = false;
};
</script>

<template>
    <v-bottom-sheet v-model="appStore.mainDrawer" inset eager>
        <BottomSheetContainer>
            <div class="mb-4">
                <div v-if="authStore.session" class="flex gap-4 p-4 rounded-md items-center bg-black-400">
                    <div class="rounded-full border-2 border-primary p-0.5">
                        <img
                            :src="authStore.session.user.user_metadata.avatar_url"
                            alt="Twitch Logo"
                            class="h-10 rounded-full"
                        />
                    </div>
                    <div>
                        <div class="text-lg font-bold leading-none pb-0.5">
                            {{ authStore.session.user.user_metadata.nickname }}
                        </div>
                        <div class="flex items-center text-sm text-muted">
                            <a
                                v-if="!authStore.isSubbed"
                                href="https://www.twitch.tv/lekkerspelen/"
                                target="_blank"
                                class="underline italic"
                            >
                                Not subscribed
                            </a>
                            <div v-else>Subscribed</div>
                            <v-icon
                                :icon="authStore.isSubbed ? 'mdi-check' : 'mdi-lock'"
                                :color="authStore.isSubbed ? 'success' : 'var(--color-red-500)'"
                                size="14"
                                class="inline-block ml-1 mt-0.5"
                            />
                        </div>
                    </div>
                    <div class="bg-black-40f0 size-f12 rounded-full ml-auto flex justify-center items-center">
                        <v-icon icon="mdi-star-four-points" size="32" class="mr-2 text-black-800" />
                    </div>
                </div>

                <div v-else class="p-4">
                    <div class="text-2xl font-bold">You are not logged in,</div>
                    <p class="text-muted">Log in with Twitch to start watching streams</p>
                    <SignInButton />
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
                                :class="[
                                    'w-full text-left px-4 py-3 bg-black-400 hover:bg-black-600 text-normal transition flex gap-3 cursor-pointer items-center first:rounded-t-md last:rounded-b-md',
                                    {
                                        'text-red-500': item.icon === 'mdi-logout',
                                        ' opacity-50 hover:bg-black-400! cursor-default!': item.disabled,
                                    },
                                ]"
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
