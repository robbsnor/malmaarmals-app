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
            path: '/videos',
            name: 'videos',
            component: () => import('../app/videos/VideosPage.vue'),
        },
        {
            path: '/videos/:id',
            name: 'video',
            component: () => import('../app/video/VideoPage.vue'),
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../app/about/AboutPage.vue'),
        },
        //     path: '/:pathMatch(.*)*',
        //     name: 'NotFound',
        //     component: () => import('@/app/base/containers/404.vue'),
        // },
    ],
    scrollBehavior(to, from, savedPosition) {
        // always scroll to top

        return { top: savedPosition.top };
    },
});

export default router;
