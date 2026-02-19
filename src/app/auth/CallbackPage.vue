<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { sleep } from '../shared/helpers/sleep';
import { useAuthStore } from './stores/auth.store';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const loading = ref(true);
const statusMessage = ref('Logging you in...');
const router = useRouter();

onMounted(async () => {
    if (!authStore.session.provider_refresh_token || !authStore.session.provider_token) {
        await router.push({ name: 'home' });
        return;
    }

    await sleep(1000);
    loading.value = false;
    statusMessage.value = 'Sending you back home...';

    await sleep(1200);
    await router.push({ name: 'home' });
});
</script>

<template>
    <Section>
        <div class="flex items-center justify-center py-12 flex-col gap-2">
            <v-progress-circular v-if="loading" indeterminate color="primary" size="48" width="4" />
            <div v-else class="flex justify-center items-center bg-green-400/20 size-12 rounded-full">
                <v-icon icon="mdi-check" size="32" color="success" />
            </div>
            <div class="text-muted">{{ statusMessage }}</div>
        </div>
    </Section>
</template>
