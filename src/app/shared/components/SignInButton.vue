<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';
import { refAutoReset } from '@vueuse/core';

const authStore = useAuthStore();
const props = defineProps();
const loading = refAutoReset(false, 7000);

async function signIn() {
    loading.value = true;
    await authStore.signIn();
}
</script>

<template>
    <v-btn
        v-bind="props"
        color="primary"
        variant="tonal"
        prepend-icon="mdi-twitch"
        @click="signIn()"
        class="w-full"
        :loading="loading"
    >
        <slot>Login</slot>
    </v-btn>
</template>
