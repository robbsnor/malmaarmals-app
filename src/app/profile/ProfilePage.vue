<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../auth/stores/auth.store';
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '../history/stores/history.store';
import VideoThumbnail from '../video/components/VideoThumbnail.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

const authStore = useAuthStore();
const historyStore = useHistoryStore();

TitleHelper.setTitle('profile');

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
        <Container>
            <div v-if="authStore.session" class="bg-black-2f00 flex items-center gap-4 rounded-md p-4 pt-10">
                <div class="border-primary rounded-full border-2 p-0.5">
                    <img
                        :src="authStore.session.user.user_metadata.avatar_url"
                        alt="Twitch Logo"
                        class="h-14 rounded-full"
                    />
                </div>
                <div>
                    <div class="pb-0.5 text-xl leading-none font-bold">
                        {{ authStore.session.user.user_metadata.nickname }}
                    </div>
                    <div class="text-muted flex items-center">
                        <a
                            v-if="!authStore.isSubbed"
                            href="https://www.twitch.tv/lekkerspelen/"
                            target="_blank"
                            class="italic underline"
                        >
                            Not subscribed
                        </a>

                        <div v-else>Subscribed</div>
                        <v-icon
                            :icon="authStore.isSubbed ? 'mdi-check' : 'mdi-lock'"
                            :color="authStore.isSubbed ? 'success' : 'var(--color-red-500)'"
                            size="16"
                            class="mt-0.5 ml-1 inline-block"
                        />
                    </div>
                </div>
                <div class="ounded-full ml-auto flex items-center justify-center">
                    <v-icon icon="mdi-star-four-points" size="32" class="text-black-800 mr-2" />
                </div>
            </div>

            <!-- <div v-if="!authStore.isSubbed">
            <div class="text-2xl font-bold">You are not subscribed,</div>
            <p class="text-muted">Subscribe to LekkerSpelen to start watching.</p>

            <v-btn
                color="primary"
                href="https://www.twitch.tv/lekkerspelen/"
                target="_blank"
                class="w-full"
                variant="tonal"
            >
                subscribe
            </v-btn>
        </div> -->

            <div v-else class="px-4 py-12">
                <div class="text-2xl font-bold">You are not logged in,</div>
                <p class="text-muted">Log in with Twitch to start watching streams</p>
                <SignInButton />
            </div>
        </Container>

        <Section v-if="authStore.session" title="History" class="w-screen!">
            <template #actions v-if="historyStore.history.length">
                <v-btn
                    :to="{ name: 'history' }"
                    class="text-primary! hover:text-primary-light!"
                    variant="text"
                    size="small"
                    append-icon="mdi-chevron-right"
                >
                    view all
                </v-btn>
            </template>

            <div
                v-if="historyStore.history.length"
                class="flex gap-4 overflow-x-auto flex-nowrap max-lg:-mx-4 max-lg:px-4"
            >
                <RouterLink
                    v-for="video in historyStore.videos.slice(0, 20)"
                    :key="video.id"
                    :to="{ name: 'video', params: { id: video.video_id } }"
                    class="w-[160px] shrink-0"
                >
                    <VideoThumbnail :video="video" class="w-full" />
                    <div class="my-2 line-clamp-2 font-bold">{{ video.title }}</div>
                </RouterLink>
            </div>

            <Empty v-else title="No history" description="You haven't watched any videos yet." icon="mdi-history" />
        </Section>

        <Container>
            <div class="flex flex-col gap-4">
                <div v-for="(group, index) in groups" :key="index">
                    <div class="flex flex-col gap-0.5">
                        <template v-for="item in group" :key="item.name">
                            <Component
                                :is="item.to ? RouterLink : 'button'"
                                :to="item.to"
                                v-if="!item.hidden"
                                @click="handleClick(item)"
                                :class="[
                                    'bg-black-300 text-normal flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition first:rounded-t-md last:rounded-b-md',
                                    {
                                        'text-red-500': item.icon === 'mdi-logout',
                                        'hover:bg-black-400': !item.disabled,
                                        'cursor-default! bg-black-200! text-muted-more!': item.disabled,
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
        </Container>
    </div>
</template>
