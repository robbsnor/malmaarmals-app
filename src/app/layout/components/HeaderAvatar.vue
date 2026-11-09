<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import NotSubscribedBadge from './NotSubscribedBadge.vue';

const authStore = useAuthStore();
</script>

<template>
    <RouterLink
        v-if="!!authStore.session"
        :to="{ name: 'profile' }"
        class="after:border-primary cursor-pointer relative inline-block h-7.5 aspect-square after:absolute after:-inset-1 after:rounded-full after:border-2 after:content-['']"
    >
        <div class="relative">
            <img
                :src="authStore.session.user.user_metadata.avatar_url"
                alt=""
                class="h-full cursor-pointer rounded-full"
            />

            <NotSubscribedBadge class="-right-2 -bottom-2" />
        </div>
    </RouterLink>
</template>
