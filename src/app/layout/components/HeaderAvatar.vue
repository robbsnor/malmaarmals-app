<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../auth/stores/auth.store';

const authStore = useAuthStore();

const settingsDialog = ref(false);

const toggleSettingsDialog = () => {
    settingsDialog.value = !settingsDialog.value;
};
</script>

<template>
    <v-menu v-if="authStore.session" location="bottom end" :offset="[4, 6]">
        <template #activator="activator">
            <a
                v-bind="activator.props"
                class="after:border-primary cursor-pointer relative inline-block h-7.5 w-7.5 after:absolute after:-inset-1 after:rounded-full after:border-2 after:content-['']"
            >
                <img :src="authStore.session.user.user_metadata.avatar_url" alt="" class="h-full w-full rounded-full" />
            </a>
        </template>

        <v-list min-width="160">
            <v-list-item prepend-icon="mdi-cog" @click="toggleSettingsDialog">Settings</v-list-item>
            <!-- <Divider /> -->
            <v-list-item :to="{ name: 'sign-out' }" prepend-icon="mdi-logout">Logout</v-list-item>
        </v-list>
    </v-menu>
</template>
