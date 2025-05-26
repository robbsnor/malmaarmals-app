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

const items = ref<DropdownMenuItem[]>([
    {
        label: 'Account',
        icon: 'i-lucide-user',
        to: '/account',
    },
    {
        label: 'Settings',
        icon: 'i-lucide-cog',
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
    <div
        ref="header"
        class="border-black-400 top-0 right-0 left-0 z-100 mb-4 flex h-[60px] items-center justify-between border-b-1 bg-black p-4"
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

        <div>
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
</template>
