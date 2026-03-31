<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from '../auth/stores/auth.store';
import { RouterLink } from 'vue-router';
import { useHistoryStore } from '../history/stores/history.store';
import VideoThumbnail from '../videos/components/VideoThumbnail.vue';
import { TitleHelper } from '../shared/helpers/title.helper';

const authStore = useAuthStore();
const historyStore = useHistoryStore();

TitleHelper.setTitle('profile');

const groups = computed(() => {
    const isSignedIn = !!authStore.session;

    return [
        [
            // { name: 'History', icon: 'mdi-history', to: '/history', hidden: !isSignedIn },
            {
                name: 'Statistics',
                description: 'Have a cool idea? Create an issue!',
                icon: 'mdi-chart-timeline-variant',
                disabled: true,
            },
            { name: 'About', to: '/about', icon: 'mdi-information' },
            { name: 'Logout', link: '/sign-out', icon: 'mdi-logout', hidden: !isSignedIn, action: 'sign-out' },
        ],
        [
            // { name: 'Statistics', to: { name: 'games' }, icon: 'mdi-chart-line' },
            // { name: 'Donate', icon: 'mdi-heart', hidden: !isSignedIn, disabled: true },
        ],
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
        <Container width="920px">
            <div v-if="authStore.session" class="flex items-center gap-4 rounded-md pt-10">
                <div class="shrink-0 border-primary rounded-full border-2 p-0.5">
                    <img
                        :src="authStore.session.user.user_metadata.avatar_url"
                        alt="Twitch Logo"
                        class="h-14 rounded-full"
                    />
                </div>

                <div>
                    <div class="pb-0.5 text-xl font-bold">
                        {{ authStore.session.user.user_metadata.nickname }}
                    </div>

                    <div class="text-muted text-sm flex items-center">
                        <v-icon
                            :icon="authStore.isSubbed ? 'mdi-check' : 'mdi-lock'"
                            :color="authStore.isSubbed ? 'success' : 'var(--color-orange-500)'"
                            size="16"
                            class="mtf-0.5 mr-1 inline-block"
                        />
                        <a
                            v-if="!authStore.isSubbed"
                            href="https://www.twitch.tv/lekkerspelen/"
                            target="_blank"
                            class="italic underline"
                        >
                            Not subbed to Lekker Spelen
                        </a>

                        <div v-else>Subscribed to Lekker Spelen</div>
                    </div>
                </div>

                <div class="ounded-full ml-auto flex items-center justify-center">
                    <v-icon icon="mdi-star-four-points" size="32" class="text-black-800 mr-2" />
                </div>
            </div>

            <div v-else class="px-4 py-12">
                <div class="text-2xl font-bold">You are not logged in,</div>
                <p class="text-muted">Log in with Twitch to start watching streams</p>
                <SignInButton />
            </div>

            <!-- <div v-if="authStore.isSubbed" class="p-4 mt-4 bg-green-300/10 border border-green-300/20 rounded-md">
                <div class="flex gap-4 pb-2">
                    <v-icon color="green" icon="mdi-cash-100" class="mr-1"></v-icon>
                    <div>
                        <div class="text-xl font-bold">Subscribed!</div>
                        <div class="text-muted">You are subscribed to Lekker Spelen and can view streams.</div>
                    </div>
                </div>

                <v-btn class="w-full" variant="tonal" color="green" target="_blank"> Watch streams </v-btn>
            </div>

            <div v-else class="p-4 mt-4 bg-orange-300/10 border border-orange-300/20 rounded-md">
                <div class="flex gap-4 pb-2">
                    <v-icon color="orange" icon="mdi-cash-100" class="mr-1"></v-icon>
                    <div>
                        <div class="text-xl font-bold">Not subscribed.</div>
                        <div class="text-muted">You need to be subscribed to Lekker Spelen to watch streams.</div>
                    </div>
                </div>

                <v-btn class="w-full" variant="tonal" color="primary" target="_blank" prepend-icon="mdi-twitch">
                    Subscribe
                </v-btn>
            </div>  -->
        </Container>

        <Section v-if="authStore.session" title="History" width="920px">
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

            <div v-if="historyStore.history.length" class="flex overflow-x-auto gap-4 max-lg:-mx-4 max-lg:px-4 pb-2">
                <RouterLink
                    v-for="video in historyStore.videos.slice(0, 10)"
                    :key="video.id"
                    :to="{ name: 'stream', params: { id: video.video_id } }"
                    class="w-[180px] shrink-0"
                >
                    <VideoThumbnail :video="video" class="w-full" />
                    <div class="my-2 line-clamp-2 font-bold">{{ video.title }}</div>
                </RouterLink>
            </div>

            <Empty v-else title="No history" description="You haven't watched any videos yet." icon="mdi-history" />
        </Section>

        <Container width="920px">
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
                                <div>
                                    <div>{{ item.name }}</div>
                                    <div v-if="item.description" class="text-sm leading-tight italic">
                                        {{ item.description }}
                                    </div>
                                </div>
                            </Component>
                        </template>
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>
