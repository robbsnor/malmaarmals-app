<script setup lang="ts">
import { ref } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useScreenSafeArea } from '@vueuse/core';
import { useRouter, RouterLink } from 'vue-router';
import { useAuthStore } from '../../auth/stores/auth.store';
import { Z } from '../../shared/directives/z.directive';

const router = useRouter();
const { top, right, bottom, left } = useScreenSafeArea();
const appStore = useAppStore();
const authStore = useAuthStore();
const menuItems = ref([
    { title: 'home', icon: 'mdi-collage', to: '/' },
    { title: 'archive', icon: 'mdi-magnify', to: '/archive', id: 'bottom-search' },
    { title: 'profile', icon: '', to: '/profile', id: 'bottom-profile' },
]);
</script>

<template>
    <div
        ref="mobileNavRef"
        :style="{ paddingBottom: bottom }"
        class="border-black-300 bg-black-100 fixed right-0 bottom-0 left-0 h-[var(--height-mobile-navbar)] border-t lg:hidden"
        v-z="Z.MOBILE_NAV"
    >
        <Container width="400px" class="h-full">
            <div class="grid h-[var(--height-mobile-navbar)] grid-cols-3 items-center justify-evenly">
                <RouterLink
                    v-for="item in menuItems"
                    :key="item.title"
                    :to="item.to"
                    :id="item?.id"
                    activeClass="text-primary"
                    class="text-muted text-light hover:text-primary-light flex cursor-pointer flex-col items-center justify-center gap-[2px] px-6 py-2 transition-all"
                >
                    <v-icon v-if="item.icon" :icon="item.icon" />

                    <template v-else-if="item?.id === 'bottom-profile'">
                        <div v-if="!!authStore.session" class="relative">
                            <img
                                :src="authStore.session.user.user_metadata.avatar_url"
                                alt=""
                                class="h-8 cursor-pointer rounded-full"
                            />
                            <div
                                v-if="!authStore.isSubbed"
                                class="absolute -right-2 -bottom-2 flex size-5 items-center justify-center rounded-full bg-black"
                            >
                                <v-icon icon=" mdi-lock" color="var(--color-red-500)" size="14" />
                            </div>
                        </div>
                        <div
                            v-else
                            class="bg-black-400 flex size-8 cursor-pointer items-end justify-center overflow-hidden rounded-full text-white/50!"
                        >
                            <svg
                                width="26"
                                height="26"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                class="translate-y-0.5"
                            >
                                <path
                                    d="M8 10.5C9.28971 10.5 11.2264 10.8143 12.8271 11.4521C13.6271 11.7709 14.3122 12.158 14.7891 12.6016C15.2616 13.0412 15.5 13.5055 15.5 14V15.5H0.5V14C0.5 13.5055 0.738403 13.0412 1.21094 12.6016C1.68776 12.158 2.37288 11.7709 3.17285 11.4521C4.77358 10.8143 6.71029 10.5 8 10.5ZM8 0.5C9.92386 0.5 11.5 2.07614 11.5 4C11.5 5.92386 9.92386 7.5 8 7.5C6.07614 7.5 4.5 5.92386 4.5 4C4.5 2.07614 6.07614 0.5 8 0.5Z"
                                    fill="currentColor"
                                />
                            </svg>
                        </div>
                    </template>
                </RouterLink>
            </div>
        </Container>
    </div>
</template>
