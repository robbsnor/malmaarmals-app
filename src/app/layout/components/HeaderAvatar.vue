<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../auth/stores/auth.store';
import NotSubscribedBadge from './NotSubscribedBadge.vue';

const authStore = useAuthStore();
const settingsDialog = ref(false);

function toggleSettingsDialog() {
    settingsDialog.value = !settingsDialog.value;
}
</script>

<template>
    <RouterLink
        :to="{ name: 'profile' }"
        class="after:border-primary cursor-pointer relative inline-block h-7.5 w-7.5 after:absolute after:-inset-1 after:rounded-full after:border-2 after:content-['']"
    >
        <!-- <img :src="authStore.session.user.user_metadata.avatar_url" alt="" class="h-full w-full rounded-full" /> -->
        <div v-if="!!authStore.session" class="relative">
            <img
                :src="authStore.session.user.user_metadata.avatar_url"
                alt=""
                class="h-8 cursor-pointer rounded-full"
            />

            <NotSubscribedBadge class="-right-2 -bottom-2" />
        </div>
    </RouterLink>
</template>
