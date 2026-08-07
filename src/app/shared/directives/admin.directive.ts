import { useAuthStore } from '../../auth/stores/auth.store';
import type { Directive } from 'vue';

export const admin: Directive<HTMLElement> = {
    mounted(el) {
        const authStore = useAuthStore();

        if (!authStore.isAdmin) {
            el.remove();
        }
    },
    updated(el) {
        const authStore = useAuthStore();

        if (!authStore.isAdmin && el.parentNode) {
            el.remove();
        }
    },
};
