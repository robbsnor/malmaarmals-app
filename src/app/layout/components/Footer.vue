<script setup lang="ts"></script>

<template>
    <Container>
        <div class="flex justify-center items-center flex-col py-10 border-tf border-gray-800">
            <div class="flex flex-col items-center gap-2 pb-4 text-gray-500">
                <span class="flex items-center gap-1">
                    Made with
                    <!-- <UIcon name="i-lucide-heart" class="text-primary-500 animate-pulse" fill="red" /> -->
                    <UIcon name="i-fe:heart" class="text-primary animate-pulse" />
                    by <RouterLink to="foo" class="underline">Robbsnor</RouterLink>
                </span>
            </div>
        </div>
    </Container>
</template>
