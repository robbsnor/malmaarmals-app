<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { sleep } from '../../shared/helpers/sleep';
import { useAppStore } from '../../shared/stores/app.store';

const appStore = useAppStore();
const splashVisible = ref(false);
const loadingVisible = ref(false);

onMounted(async () => {
    await sleep(500);
    splashVisible.value = true;
    await sleep(1700);
    loadingVisible.value = true;
});

function refresh() {
    window.location.reload();
}
</script>

<template>
    <div class="fixed h-full w-full flex flex-col items-center justify-center">
        <Container class="flex flex-col gap-10 items-center">
            <!-- loading -->
            <div
                class="transition-all duration-1000 w-9/12 max-w-100"
                :class="splashVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            >
                <Logo payoff />
            </div>

            <template v-if="appStore.loading">
                <v-progress-linear
                    color="primary"
                    class="transition-all duration-2000! w-6/12! max-w-100!"
                    :class="loadingVisible ? 'opacity-100  ' : 'opacity-0 '"
                    indeterminate
                />
            </template>

            <!-- error -->
            <div v-if="appStore.hasError" class="text-center">
                <p>Doing some maintenance, we will be back soon.</p>

                <img
                    class="inline w-6"
                    src="https://static-cdn.jtvnw.net/emoticons/v2/717918/default/dark/2.0"
                    alt=""
                />
            </div>
        </Container>
    </div>
</template>
