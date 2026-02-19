<script setup lang="ts">
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth.store';
import { sleep } from '../shared/helpers/sleep';

const authStore = useAuthStore();

onMounted(async () => {
    await sleep(1000);
    await authStore.signOut();
});
</script>

<template>
    <Container>
        <div class="flex items-center justify-center py-20 flex-col gap-2">
            <div class="text-muted">Logging you out...</div>
        </div>
    </Container>
</template>
