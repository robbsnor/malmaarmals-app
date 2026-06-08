import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';
import { useLocalStorage, useStorage } from '@vueuse/core';
import { useTwitch } from '../../shared/composables/useTwitch.composable';
import { useRouter } from 'vue-router';
import { useVideoStore } from '../../videos/stores/video.store';
import { Capacitor } from '@capacitor/core';

export const LEKKER_SPELEN_USER_ID = 52385053;

function getOAuthRedirectUrl() {
    if (Capacitor.isNativePlatform()) {
        return 'malmaarmals://auth/callback';
    }

    return `${window.location.origin}/auth/callback`;
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    const session = useLocalStorage<Session | null>('session', null);
    const videoStore = useVideoStore();

    const twitchAccessToken = useStorage<string | null>('twitch_access_token', null);
    const twitchRefreshToken = useStorage<string | null>('twitch_refresh_token', null);

    const twitchUserId = computed(() => Number(session.value?.user?.user_metadata?.sub));
    const isSubbed = ref(false);
    const isAdmin = computed(() => session.value?.user?.user_metadata?.name === 'robbsnor');

    const twitch = useTwitch();

    let hasAuthStateChangeListener = false;

    const syncSession = (newSession: Session | null) => {
        session.value = newSession;

        if (!newSession) {
            twitchAccessToken.value = null;
            twitchRefreshToken.value = null;
            isSubbed.value = false;
            return;
        }

        if (newSession.provider_token) {
            twitchAccessToken.value = newSession.provider_token;
        }

        if (newSession.provider_refresh_token) {
            twitchRefreshToken.value = newSession.provider_refresh_token;
        }
    };

    const mirrorSession = async () => {
        const { data } = await supabase.auth.getSession();

        syncSession(data.session);

        if (!hasAuthStateChangeListener) {
            supabase.auth.onAuthStateChange((_event, newSession) => {
                syncSession(newSession);
            });

            hasAuthStateChangeListener = true;
        }
    };

    const updateIsSubscribed = async () => {
        isSubbed.value = false;

        const { error } = await twitch.checkUserSubscription(LEKKER_SPELEN_USER_ID);

        if (error) {
            console.error('Subscription check failed:', error);
            return false;
        }

        isSubbed.value = true;
        return true;
    };

    const signIn = async () => {
        const redirectTo = getOAuthRedirectUrl();

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo,
                scopes: 'user:read:subscriptions',
            },
        });

        if (error) {
            throw error;
        }

        console.log(data);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();

        console.log(error);

        session.value = null;
        twitchAccessToken.value = null;
        twitchRefreshToken.value = null;
        isSubbed.value = false;
        videoStore.playerIsActive = false;

        await router.push({ name: 'home' });

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