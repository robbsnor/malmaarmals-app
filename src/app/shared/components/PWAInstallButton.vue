<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { usePwaInstall } from '../composables/usePWAInstall.composable';

let installPrompt = ref(null);
let isInstalled = ref(false);

onMounted(() => {
    console.log('mounted');
    window.addEventListener('beforeinstallprompt', (event) => {
        console.log('event beforeinstallprompt');
        event.preventDefault();
        installPrompt.value = event;
        isInstalled.value = true;
    });

    window.addEventListener('appinstalled', () => {
        console.log('event appinstalled');
        isInstalled.value = true;
    });
});

function install() {
    console.log(installPrompt.value);
    installPrompt.value.prompt();
}
</script>

<template>
    <Admin>
        <div class="flex gap-4 p-4 border border-black-600 rounded-md bg-black-100">
            <div
                class="bg-black-200 p-2 rounded-xl border border-black-600 aspect-square w-8f flex items-center justify-center shrink-0"
            >
                <img src="/images/m.svg" class="w-6" alt="" />
            </div>

            <div>
                <div class="text-lg font-bold">Download App (PWA)</div>
                <div></div>
            </div>

            <div class="ml-auto p-2 bg-red-200">
                <v-icon>mdi-download</v-icon>
            </div>
        </div>

        <v-btn @click="install()">install</v-btn>

        <div>
            <div>isInstalled: {{ isInstalled }}</div>
            <div>installPrompt: {{ installPrompt }}</div>
        </div>
    </Admin>
</template>
