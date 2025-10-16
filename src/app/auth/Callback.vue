<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { sleep } from '../shared/helpers/sleep';
import { useAuthStore } from './stores/auth.store';
import CheckItem from './components/CheckItem.vue';
import { useRouter } from 'vue-router';

const loading = ref(true);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
    // Handle the OAuth callback if needed
    await router.push({ path: '/' });
    await sleep(2000);
    loading.value = false;
});
</script>

<template>
    <Container>
        <!-- <div v-if="loading" class="flex items-center justify-center py-12 flex-col gap-2">
            <v-progress-circular indeterminate color="primary" size="48" width="4" />
            <div class="text-muted">Logging you in...</div>
        </div> -->

        <div class="flex items-center justify-center py-12 flex-col gap-2">
            <div
                v-if="authStore.session"
                class="bg-black-200 border border-black-500 rounded-2xl p-6 flex flex-col gap-1"
            >
                <CheckItem :success="!!authStore.session" title="Logged in"></CheckItem>
                <CheckItem title="Subscribed to LekkerSpelen"></CheckItem>
                <CheckItem isLast title="Ready to watch streams LekkerSicko!"></CheckItem>
            </div>
            <div v-else class="text-muted">Could not log you in.</div>
        </div>
    </Container>
</template>
