// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    modules: [
        "@nuxt/ui",
        "@formkit/auto-animate/nuxt",
        "@nuxtjs/supabase",
        "@pinia/nuxt",
        "@nuxt/fonts",
    ],
    css: ["~/assets/css/main.css"],
    supabase: {
        redirect: false,
        // redirectOptions: {
        //     login: "/",
        //     callback: "/confirm",
        // },
    },
    fonts: {
        provider: "google",
        google: {
            families: ["Inter:400,500,600,700", "Roboto:400,500,700"],
        },
    },
    components: [
        {
            path: "~/components",
            pathPrefix: false,
        },
    ],
    devServer: {
        port: 4000,
    },
    devtools: { enabled: true },
});
