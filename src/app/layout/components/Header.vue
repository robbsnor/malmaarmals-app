<script setup lang="ts">
import { useElementSize, useMagicKeys } from '@vueuse/core';
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';
import { useVideosStore } from '../../video/stores/videos.store';

const appStore = useAppStore();
const videosStore = useVideosStore();

const keys = useMagicKeys();
const headerRef = useTemplateRef<HTMLDivElement>('headerRef');

appStore.headerSize = useElementSize(headerRef);

const loggedIn = ref(true);

const cssClass = computed(() => {
    return {
        hamburger: true,
        'is-open': appStore.menuOpen,
    };
});

watch(keys['Meta+K'], () => videosStore.goToVideosPage());
</script>

<template>
    <div
        ref="headerRef"
        class="top-0 right-0 left-0 z-100 bg-black/70 fixed backdrop-blur-md transition-transform ease-linear"
        :class="{ 'translate-y-[-100%]': !appStore.showHeader }"
    >
        <Container>
            <div
                class="grid grid-cols-[auto_auto] md:grid-cols-[1fr_auto_auto] xl:grid-cols-[1fr_auto_1fr] justify-between items-center gap-2 h-header py-2"
            >
                <div class="flex items-center gap-4">
                    <button class="cursor-pointer -ml-2" :class="cssClass" @click="appStore.toggleMenu">
                        <span class="sr-only">Menu</span>
                        <div class="hamburger__stroke"></div>
                        <div class="hamburger__stroke"></div>
                    </button>

                    <RouterLink to="/" class="flex flex-col gap-[2px]">
                        <div class="text-2xl leading-[1] font-bold uppercase">MalMaarMals</div>
                        <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                    </RouterLink>
                </div>

                <div class="hidden md:flex items-center justify-center gap-2">
                    <v-text-field
                        type="text"
                        v-model="videosStore.query"
                        :rounded="true"
                        placeholder="Search..."
                        :density="'compact'"
                        hide-details="auto"
                        append-inner-icon="mdi-magnify"
                        class="w-80 xl:w-100"
                    />
                    <v-btn icon="mdi-filter-variant " variant="text" color="#BCBCBC" class="cursor-pointer"></v-btn>
                </div>

                <div class="flex items-center justify-end gap-4">
                    <div class="md:hidden -mt-[2px]">
                        <v-icon @click="videosStore.goToVideosPage" icon="mdi-magnify" color="#ccc" />
                    </div>

                    <div v-if="loggedIn" class="rounded-full border-2 border-primary p-0.5">
                        <img
                            src="https://static-cdn.jtvnw.net/jtv_user_pictures/e346d390-fe98-4c2a-baae-327288c8c55b-profile_image-300x300.png"
                            alt="Twitch Logo"
                            class="h-8 rounded-full"
                        />
                    </div>

                    <v-btn v-else append-icon="mdi-twitch" color="primary">Login</v-btn>
                </div>
            </div>
        </Container>

        <Stroke class="absolute bottom-0 left-0 right-0"></Stroke>
    </div>

    <div
        class="fixed group invisible opacity-0 transition-full z-30 inset-0 transition-all backdrop-blur-md"
        :class="{ 'visible opacity-100': appStore.menuOpen }"
    >
        <button @click="appStore.toggleMenu" class="absolute top-0 right-0 h-full bg-black/50 w-full">
            <span class="sr-only">Close menu</span>
        </button>

        <div class="bg-black pt-[var(--height-header)] min-h-100">
            <Container> My little menu </Container>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hamburger {
    $self: &;
    padding: 10px;

    &__stroke {
        height: 2px;
        width: 17px;
        background-color: white;
        transition: transform 0.1s cubic-bezier(0.25, 0, 0.75, 1.3);

        &:first-of-type {
            width: 25px;
            margin-bottom: 5px;
        }
    }

    &:hover {
        #{ $self }__stroke {
            &:first-of-type {
                transform: translateX(2px);
            }

            &:last-of-type {
                transform: translateX(-2px);
            }
        }
    }

    &.is-open {
        #{ $self }__stroke {
            width: 25px;

            &:first-of-type {
                transform: rotate(-45deg);
                margin-bottom: -2px;
            }

            &:last-of-type {
                transform: rotate(45deg);
            }
        }
    }
}
</style>
