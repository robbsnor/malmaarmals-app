import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
    const session = ref<Session>();

    const upadateSession = async () => {
        const { data } = await supabase.auth.getSession();
        session.value = data.session;

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
        });
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        session.value = null;
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

    const isAdmin = computed(() => {
        const user = session.value?.user;
        return user?.user_metadata.name === 'robbsnor';
    });

    return {
        session,
        isAdmin,

        upadateSession,
        signOut,
        signIn,
    };
});
