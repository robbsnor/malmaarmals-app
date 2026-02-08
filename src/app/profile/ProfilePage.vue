<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../auth/stores/auth.store';
import { useAppStore } from '../shared/stores/app.store';
import { useRouter, RouterLink } from 'vue-router';
import SignInButton from '../shared/components/SignInButton.vue';
import { useHistoryStore } from '../video/stores/history.store';
import { BucketHelper } from '../shared/helpers/bucket.helper';

const authStore = useAuthStore();
const appStore = useAppStore();
const historyStore = useHistoryStore();

const groups = computed(() => {
    const isSignedIn = !!authStore.session;

    return [
        [
            // { name: 'History', icon: 'mdi-history', to: '/history', hidden: !isSignedIn },
            { name: 'Prefferences', icon: 'mdi-cog', hidden: !isSignedIn, disabled: true },
        ],
        [
            { name: 'Statistics', icon: 'mdi-chart-line', disabled: true },
            { name: 'About', to: '/about', icon: 'mdi-information' },
            // { name: 'Donate', icon: 'mdi-heart', hidden: !isSignedIn, disabled: true },
        ],
        [{ name: 'Logout', link: '/sign-out', icon: 'mdi-logout', hidden: !isSignedIn, action: 'sign-out' }],
    ].filter((group) => group.some((item) => !item.hidden)) as any;
});

const handleClick = async (item: any) => {
    if (item.disabled) return;

    if (item.action === 'sign-out') {
        await authStore.signOut();
    }
};
</script>

<template>
    <div>
        <div class="p-4 pb-0">
            <div v-if="authStore.session" class="flex gap-4 p-4 rounded-md items-center bg-black-400">
                <div class="rounded-full border-2 border-primary p-0.5">
                    <img
                        :src="authStore.session.user.user_metadata.avatar_url"
                        alt="Twitch Logo"
                        class="h-10 rounded-full"
                    />
                </div>
                <div>
                    <div class="text-lg font-bold leading-none pb-0.5">
                        {{ authStore.session.user.user_metadata.nickname }}
                    </div>
                    <div class="flex items-center text-sm text-muted">
                        <a
                            v-if="!authStore.isSubbed"
                            href="https://www.twitch.tv/lekkerspelen/"
                            target="_blank"
                            class="underline italic"
                        >
                            Not subscribed
                        </a>
                        <div v-else>Subscribed</div>
                        <v-icon
                            :icon="authStore.isSubbed ? 'mdi-check' : 'mdi-lock'"
                            :color="authStore.isSubbed ? 'success' : 'var(--color-red-500)'"
                            size="14"
                            class="inline-block ml-1 mt-0.5"
                        />
                    </div>
                </div>
                <div class="bg-black-40f0 size-f12 rounded-full ml-auto flex justify-center items-center">
                    <v-icon icon="mdi-star-four-points" size="32" class="mr-2 text-black-800" />
                </div>
            </div>

            <div v-else class="p-4">
                <div class="text-2xl font-bold">You are not logged in,</div>
                <p class="text-muted">Log in with Twitch to start watching streams</p>
                <SignInButton />
            </div>
        </div>

        <Section title="History" v-if="authStore.session">
            <template #actions>
                <v-btn
                    :to="{ name: 'history' }"
                    class="text-primary! hover:text-primary-light!"
                    variant="text"
                    append-icon="mdi-chevron-right"
                >
                    view all
                </v-btn>
            </template>

            <div class="flex gap-4 overflow-auto -mx-4 px-4">
                <div v-for="video in historyStore.videos.slice(0, 10)" :key="video.id" class="w-[200px] shrink-0">
                    <img :src="BucketHelper.getThumbnailUrl(video.video_id)" alt="" class="w-full rounded-md" />
                    <div class="line-clamp-2 break-all py-2">{{ video.title }}</div>
                </div>
            </div>
        </Section>

        <div class="flex gap-4 flex-col px-4">
            <div v-for="(group, index) in groups" :key="index">
                <div class="flex flex-col gap-0.5">
                    <template v-for="item in group" :key="item.name">
                        <Component
                            :is="item.to ? RouterLink : 'button'"
                            :to="item.to"
                            v-if="!item.hidden"
                            @click="handleClick(item)"
                            :class="[
                                'w-full text-left px-4 py-3 bg-black-400 hover:bg-black-600 text-normal transition flex gap-3 cursor-pointer items-center first:rounded-t-md last:rounded-b-md',
                                {
                                    'text-red-500': item.icon === 'mdi-logout',
                                    ' opacity-50 hover:bg-black-400! cursor-default!': item.disabled,
                                },
                            ]"
                        >
                            <v-icon :icon="item.icon" size="16" />
                            {{ item.name }}
                        </Component>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>
