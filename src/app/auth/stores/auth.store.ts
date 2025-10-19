import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';
import { useStorage } from '@vueuse/core';
import { useTwitch } from '../../shared/helpers/twitch-api.service';

export const useAuthStore = defineStore('auth', () => {
    const session = ref<Session>();
    const twitchAccessToken = useStorage('twitch_access_token', null);
    const twitchRefreshToken = useStorage('twitch_refresh_token', null);
    const isSubbed = ref(false);

    const twitch = useTwitch();

    const mirrorSession = async () => {
        const { data } = await supabase.auth.getSession();
        session.value = data.session;

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
        });
    };

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'user:read:follows user:read:subscriptions moderator:read:followers',
                skipBrowserRedirect: false,
            },
        });
        if (error) {
            console.error(error);
        } else {
            console.log(data);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();

        twitchAccessToken.value = null;
        twitchRefreshToken.value = null;
        isSubbed.value = false;
    };

    const checkSubscription = async () => {
        if (!twitchAccessToken.value || !twitchRefreshToken.value) return;

        // const res = await twitch.checkUserSubscription(31239503);
        const res = await twitch.checkUserSubscription(52385053);
        isSubbed.value = res;
    };

    const isAdmin = computed(() => {
        const user = session.value?.user;
        return user?.user_metadata.name === 'robbsnor';
    });

    async function refreshTwitchToken() {
        const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/refresh-twitch-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                refresh_token: twitchRefreshToken.value,
            }),
        });

        const { access_token, refresh_token } = await res.json();
        console.log({
            access_token,
            refresh_token,
        });
        twitchAccessToken.value = access_token;
        twitchRefreshToken.value = refresh_token;
    }

    return {
        session,
        isAdmin,
        twitchAccessToken,
        twitchRefreshToken,
        isSubbed,

        mirrorSession,
        signOut,
        signIn,
        refreshTwitchToken,
        checkSubscription,
    };
});
