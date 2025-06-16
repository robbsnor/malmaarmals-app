<script setup lang="ts">
const appStore = useAppStore()
</script>

<template>
    <UApp style="padding-top: 60px">
        <Header class="fixed top-0 right-0 left-0 z-50" ref="header" />

        <div style="padding-top: 60px">
            <NuxtLayout>
                <NuxtPage />
                <NuxtRouteAnnouncer />
            </NuxtLayout>
        </div>
    </UApp>
</template>
