<script setup lang="ts">
import { useDisplay } from 'vuetify';

const display = useDisplay();
</script>

<template>
    <div class="hidden sm:block">sm</div>
    <div class="hidden md:block">md</div>
    <div class="hidden lg:block">lg</div>
    <div class="hidden xl:block">xl</div>
    <div class="hidden 2xl:block">2xl</div>
    <hr />
    {{ display.name }}
</template>
