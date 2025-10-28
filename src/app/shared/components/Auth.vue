<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../../auth/stores/auth.store';

const authStore = useAuthStore();
</script>

<template>
    <template v-if="authStore.isAdmin">
        <slot></slot>
    </template>
</template>
