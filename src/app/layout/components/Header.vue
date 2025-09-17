<script setup lang="ts">
import { useElementSize, useMagicKeys } from '@vueuse/core';
import { computed, useTemplateRef, watch } from 'vue';
import { useAppStore } from '../../shared/stores/app.store';

const appStore = useAppStore();

const keys = useMagicKeys();
const headerRef = useTemplateRef<HTMLDivElement>('headerRef');

appStore.headerSize = useElementSize(headerRef);

const cssClass = computed(() => {
    return {
        hamburger: true,
        'is-open': appStore.menuOpen,
    };
});

watch(keys['Meta+K'], () => appStore.focusSearch());
</script>

<template>
    <div
        ref="headerRef"
        class="top-0 right-0 left-0 z-100 bg-black/70 fixed backdrop-blur-md transition-transform ease-linear"
        :class="{ 'translate-y-[-100%]': !appStore.showHeader }"
    >
        <Container>
            <div class="h-header flex justify-between items-center py-2 gap-4">
                <div class="flex items-center gap-4 md:gap-8">
                    <button class="cursor-pointer -ml-4 md:hidden" :class="cssClass" @click="appStore.toggleMenu">
                        <span class="sr-only">Menu</span>
                        <div class="hamburger__stroke"></div>
                        <div class="hamburger__stroke"></div>
                    </button>

                    <RouterLink to="/" class="flex flex-col gap-[2px]">
                        <div class="text-2xl leading-[1] font-bold uppercase">MalMaarMals</div>
                        <div class="text-sm leading-[1] text-gray-500">lekkerspelen archive</div>
                    </RouterLink>

                    <div class="hidden md:flex gap-4 items-center">
                        <RouterLink to="/videos">Videos</RouterLink>
                        <RouterLink to="/playlists">Playlists</RouterLink>
                        <RouterLink to="/about">About</RouterLink>
                    </div>
                </div>

                <div class="flex items-center gap-4">
                    <v-icon @click="appStore.focusSearch" icon="mdi-magnify" />
                    <v-btn append-icon="mdi-twitch" color="primary">Login</v-btn>
                </div>
            </div>
        </Container>
        <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-radial from-black-800 to-transparent"></div>
    </div>

    <div
        class="fixed group invisible opacity-0 transition-full z-30 inset-0 transition-all"
        :class="{ 'visible opacity-100': appStore.menuOpen }"
    >
        <button @click="appStore.toggleMenu" class="absolute top-0 right-0 h-full bg-black/50 w-full">
            <span class="sr-only">Close menu</span>
        </button>

        <div class="bg-black pt-[var(--height-header)] min-h-100">
            <Container> yolo </Container>
        </div>
    </div>
</template>

<style scoped lang="scss">
.hamburger {
    $self: &;
    padding: 20px;

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
