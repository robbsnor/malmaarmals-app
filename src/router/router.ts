import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../app/home/HomePage.vue'),
        },
        {
            path: '/archive',
            name: 'archive',
            component: () => import('../app/archive/ArchivePage.vue'),
        },
        {
            path: '/video/:id',
            name: 'video',
            component: () => import('../app/video/VideoPage.vue'),
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
            component: () => import('../app/history/HistoryPage.vue'),
        },
        {
            path: '/auth/callback',
            name: 'callback',
            component: () => import('../app/auth/Callback.vue'),
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

export default router;
