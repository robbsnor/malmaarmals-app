// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    modules: [
        "@nuxt/ui",
        "@formkit/auto-animate/nuxt",
        "@nuxtjs/supabase",
    ],
    css: ["~/assets/css/main.css"],
    supabase: {
        redirect: false,
    },
    devServer: {
        port: 3030,
    },
    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],
    devtools: { enabled: true },
});
