<script setup lang="ts">
import { useAuthStore } from '../../auth/stores/auth.store';

const authStore = useAuthStore();
</script>

<template>
    <v-tooltip text="Not subscribed" location="left">
        <template #activator="{ props }">
            <div
                v-if="!authStore.isSubbed"
                v-bind="{ ...props, ...$attrs }"
                class="absolute flex size-5 items-center justify-center rounded-full bg-black-100 z-1"
            >
                <v-icon icon="mdi-lock" class="-mt-0.5" color="var(--color-red-500)" size="14" />
            </div>
        </template>
    </v-tooltip>
</template>
