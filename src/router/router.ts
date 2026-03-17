import { createRouter, createWebHistory, type RouteLocationNormalizedLoadedGeneric } from 'vue-router';
import { useAuthStore } from '../app/auth/stores/auth.store';

declare module 'vue-router' {
    interface RouteMeta {
        showSearch?: boolean;
        showTabs?: boolean;
        showFooter?: boolean;
    }
}

const isLoggedIn = () => {
    const authStore = useAuthStore();
    if (!authStore.session) {
        return { name: 'home' };
    }
};

const routeHistory: RouteLocationNormalizedLoadedGeneric[] = [];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            meta: { showSearch: true },
            component: () => import('../app/home/HomePage.vue'),
        },
        {
            path: '/videos',
            alias: '/streams',
            name: 'streams',
            meta: { showTabs: true },
            component: () => import('../app/videos/VideosPage.vue'),
        },
        {
            path: '/playlists',
            name: 'playlists',
            meta: { showTabs: true },
            component: () => import('../app/playlists/PlaylistsPage.vue'),
        },
        {
            path: '/games',
            name: 'games',
            meta: { showTabs: true },
            component: () => import('../app/categories/CategoriesPage.vue'),
        },
        {
            path: '/videos/:id',
            name: 'video',
            component: () => import('../app/videos/VideoPage.vue'),
            meta: { showFooter: false },
        },
        {
            path: '/playlists/:id',
            name: 'playlist',
            component: () => import('../app/playlists/PlaylistPage.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../app/about/AboutPage.vue'),
        },
        {
            path: '/history',
            name: 'history',
            beforeEnter: (to, from) => {
                return isLoggedIn();
            },
            component: () => import('../app/history/HistoryPage.vue'),
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../app/profile/ProfilePage.vue'),
        },
        {
            path: '/auth/callback',
            name: 'callback',
            component: () => import('../app/auth/CallbackPage.vue'),
        },
        {
            path: '/auth/sign-out',
            name: 'sign-out',
            component: () => import('../app/auth/SignOutPage.vue'),
        },
        {
            path: '/playground',
            name: 'playground',
            component: () => import('../app/layout/PlaygroundPage.vue'),
        },

        //     path: '/:pathMatch(.*)*',
        //     name: 'NotFound',
        //     component: () => import('@/app/base/containers/404.vue'),
        // },
    ],
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top

        return { top: savedPosition?.top || 0 };
    },
});

router.beforeEach((to, from, next) => {
    routeHistory.push(from);
    next();
});

export { routeHistory };
export default router;
