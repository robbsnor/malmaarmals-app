import { defineStore } from 'pinia';
import { computed, onMounted, ref } from 'vue';
import { supabase } from '../../../supabase';
import type { Session } from '@supabase/supabase-js';

export const useAuthStore = defineStore('auth', () => {
    const session = ref<Session>();

    const getSession = async () => {
        const { data } = await supabase.auth.getSession();
        session.value = data.session;

        supabase.auth.onAuthStateChange((_event, newSession) => {
            session.value = newSession;
        });
    };

    const isAdmin = computed(() => {
        const user = session.value?.user;
        return user?.id === import.meta.env.VITE_ADMIN_USER_ID;
    });

    return { session, isAdmin, getSession };
});
