import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../home/Home.vue'),
        },
        {
            path: '/videos',
            name: 'videos',
            component: () => import('../videos/Videos.vue'),
        },
        {
            path: '/videos/:id',
            name: 'video-details',
            component: () => import('../video/Video.vue'),
        },
        //     path: '/:pathMatch(.*)*',
        //     name: 'NotFound',
        //     component: () => import('@/app/base/containers/404.vue'),
        // },
    ],
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top
        return { top: 0 };
    },
});

export default router;
