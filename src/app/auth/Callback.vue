<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { sleep } from '../shared/helpers/sleep';
import { useAuthStore } from './stores/auth.store';
import { useRouter } from 'vue-router';
import { randomNumber } from '../shared/helpers/randomNumber';
import { useTwitch } from '../shared/helpers/twitch-api.service';

const authStore = useAuthStore();
const loading = ref(true);
const statusMessage = ref('Logging you in...');
const router = useRouter();
const twitch = useTwitch();

onMounted(async () => {
    if (!authStore.session.provider_refresh_token || !authStore.session.provider_token) {
        await router.push({ name: 'home' });
        return;
    }

    authStore.twitchAccessToken = authStore.session.provider_token;
    authStore.twitchRefreshToken = authStore.session.provider_refresh_token;

    await authStore.checkSubscription();

    await sleep(randomNumber(2000, 3000));
    statusMessage.value = 'Sending you back home...';

    await sleep(randomNumber(2000, 3000));
    await router.push({ name: 'home' });
});
</script>

<template>
    <Container>
        <div v-if="loading" class="flex items-center justify-center py-12 flex-col gap-2">
            <v-progress-circular indeterminate color="primary" size="48" width="4" />
            <div class="text-muted">{{ statusMessage }}</div>
        </div>
    </Container>
</template>
