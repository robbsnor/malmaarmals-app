<script setup>
import { ref } from 'vue';

import PlayerButton from './PlayerButton.vue';

const casting = ref(false);
const status = ref('Click to open the casting menu');

function openCast() {
    if (window.PresentationRequest) {
        const req = new PresentationRequest([window.location.href]);
        req.getAvailability()
            .then(() => {
                casting.value = true;
                status.value = 'Opening cast menu…';
                return req.start();
            })
            .then((conn) => {
                status.value = `Casting to: ${conn.id}`;
            })
            .catch(() => {
                casting.value = false;
                status.value = 'Cast cancelled or no devices found.';
            });
    } else {
        fallback();
    }
}

function fallback() {
    status.value = 'Use your browser menu → Cast… to cast this tab.';
    alert('To cast:\n• Chrome/Edge: Menu (⋮) → Cast…\n• Or press the cast icon in your browser toolbar.');
}
</script>

<template>
    <PlayerButton :icon="casting ? 'mdi-cast-off' : 'mdi-cast'" @click="openCast">woowow</PlayerButton>
</template>
