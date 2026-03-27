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
                class="transition-all duration-1000 w-9/12"
                :class="splashVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'"
            >
                <Logo payoff />
            </div>

            <template v-if="appStore.loading">
                <v-progress-linear
                    color="primary"
                    class="transition-all duration-2000! w-6/12!"
                    :class="loadingVisible ? 'opacity-100  ' : 'opacity-0 '"
                    indeterminate
                />
            </template>

            <!-- error -->
            <div v-if="appStore.hasError" class="text-center">
                <div class="text-4xl font-bold pb-2">Oops,</div>
                <div class="text-muted">
                    <p>
                        Since this App is partially self hosted, <br />
                        it is probably down for maintenance or went up in flames.
                    </p>
                    <p>We'll be back soon.</p>
                    <p>
                        <img
                            class="inline w-6"
                            src="https://static-cdn.jtvnw.net/emoticons/v2/717918/default/dark/2.0"
                            alt=""
                        />
                    </p>
                    <p>
                        <v-btn @click="refresh()" variant="tonal" color="primary">retry</v-btn>
                    </p>
                </div>
            </div>
        </Container>
    </div>
</template>
