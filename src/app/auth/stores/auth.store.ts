import { defineStore } from 'pinia';
import { computed, reactive, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';
import { reactify, useFetch, useStorage } from '@vueuse/core';
import { useTwitch } from '../../shared/composables/useTwitch.composable';

export const useAuthStore = defineStore('auth', () => {
    const session = ref<Session>();
    const twitchAccessToken = useStorage('twitch_access_token', null);
    const twitchRefreshToken = useStorage('twitch_refresh_token', null);
    const twitch = useTwitch();
    const twitchUserId = computed(() => session.value?.user.user_metadata?.sub as string);
    const lekkerSpelenUserId = '52385053';
    const isSubbed = ref(false);
    const isAdmin = computed(() => session.value?.user?.user_metadata.name === 'robbsnor');
    const followedStreams = twitch.getFollowedStreams();

    const mirrorSession = async () => {
        const { data } = await supabase.auth.getSession();
        session.value = data.session ?? undefined;
        twitchAccessToken.value = data.session?.provider_token;
        twitchRefreshToken.value = data.session?.provider_refresh_token;

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
        });
    };

    const updateIsSubscribed = async () => {
        // const res = await twitch.checkUserSubscription(lekkerSpelenUserId);
        // isSubbed.value = res.data?.data?.length > 0;
    };

    const signIn = async () => {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'twitch',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                scopes: 'user:read:subscriptions user:read:follows',
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

    return {
        session,
        isAdmin,
        twitchAccessToken,
        twitchRefreshToken,
        twitchUserId,
        isSubbed,
        twitch,

        followedStreams,
        updateIsSubscribed,
        mirrorSession,
        signOut,
        signIn,
    };
});
