<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const appStore = useAppStore()
const { header } = storeToRefs(appStore)

const signIn = async () => {
    await supabase.auth.signInWithOAuth({
        provider: 'twitch',
    })
}

const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Account',
        icon: 'i-lucide-user',
        to: '/account',
    },
    {
        label: 'Settings',
        icon: 'i-lucidde-cog',
        to: '/settings',
    },
    {
        type: 'separator',
    },
    {
        label: 'Log out',
        icon: 'i-lucide-log-out',
    },
])
</script>

<template>
    <div ref="header" class="top-0 right-0 left-0 z-100 bg-black/75 px-4">
        <div
            class="grid h-(--header-height) py-2 backdrop-blur-2xl"
            style="grid-template-columns: 1fr auto 1fr"
        >
            <div class="flex items-center gap-8">
                <RouterLink to="/" class="flex flex-col gap-[2px]">
                    <div class="text-2xl leading-[1] font-black uppercase">
                        malmaarmals
                    </div>
                    <div class="text-sm leading-[1] text-gray-500">
                        lekkerspelen archive
                    </div>
                </RouterLink>

                <div class="flex items-center gap-2">
                    <UButton variant="soft" size="xl" to="/">Home</UButton>
                    <UButton variant="soft" size="xl" to="/videos">
                        Videos
                    </UButton>
                </div>
            </div>

            <Search />

            <div class="flex items-center justify-end">
                <UButton
                    icon="i-lucide-maximize"
                    size="md"
                    color="primary"
                    variant="soft"
                    @click="toggleFullscreen"
                    class="mr-2"
                />

                <template v-if="user">
                    <UDropdownMenu
                        arrow
                        :items="items"
                        :content="{
                            align: 'start',
                            side: 'bottom',
                            sideOffset: 8,
                        }"
                        :ui="{
                            content: 'w-48',
                        }"
                    >
                        <img
                            class="aspect-square h-10 cursor-pointer rounded-full"
                            :src="user?.user_metadata.avatar_url"
                            alt=""
                        />
                    </UDropdownMenu>
                    <!-- @click="supabase.auth.signOut()" -->
                </template>

                <UButton
                    v-else
                    @click="signIn"
                    icon="i-lucide-twitch"
                    size="md"
                    color="primary"
                    variant="solid"
                >
                    Sign in with Twitch
                </UButton>
            </div>
        </div>
    </div>
</template>
