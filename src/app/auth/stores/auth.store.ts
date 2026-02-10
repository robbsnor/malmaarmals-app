import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';
import { useLocalStorage, useStorage } from '@vueuse/core';
import { useTwitch } from '../../shared/composables/useTwitch.composable';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const session = useLocalStorage<Session>('session', null);
    const twitchAccessToken = useStorage('twitch_access_token', null);
    const twitchRefreshToken = useStorage('twitch_refresh_token', null);
    const twitch = useTwitch();
    const twitchUserId = computed(() => session.value?.user.user_metadata?.sub as string);
    const lekkerSpelenUserId = 52385053;
    // const lekkerSpelenUserId = 197790255;

    const isSubbed = ref(false);
    const isAdmin = computed(() => session.value?.user?.user_metadata.name === 'robbsnor');
    // const isAdmin = computed(() => session.value?.user?.user_metadata.name !== 'robbsnor');

    const mirrorSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        session.value = data.session;

        if (!data.session) return;
        if (data.session.provider_refresh_token && data.session.provider_token) {
            twitchAccessToken.value = data.session.provider_token;
            twitchRefreshToken.value = data.session.provider_refresh_token;
        }

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
        });
    };

    const updateIsSubscribed = async () => {
        const { data, error } = await twitch.checkUserSubscription(lekkerSpelenUserId);
        // if (error) return;
        isSubbed.value = true;
    };

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'user:read:subscriptions',
            },
        });
        if (error) throw error;

        console.log(data);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        console.log(error);
        // if (error) throw error;

        twitchAccessToken.value = null;
        twitchRefreshToken.value = null;
        router.push({ name: 'home' });
        window.location.reload();
    };

    return {
        session,
        isAdmin,
        twitchAccessToken,
        twitchRefreshToken,
        twitchUserId,
        isSubbed,

        updateIsSubscribed,
        mirrorSession,
        signOut,
        signIn,
    };
});
