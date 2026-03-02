<script setup lang="ts"></script>

<template>
    <div class="lg:bg-black border-t border-black-400">
        <Container>
            <div class="flex justify-center items-center">
                <div class="inline-grid grid-cols-[1fr_auto_1fr] gap-1 items-center text-muted-more py-10">
                    <div class="place-self-end">Made with</div>

                    <v-icon icon="mdi-heart-outline" class="text-primary animate-pulse -mt-1 mx-1" />

                    <div class="self-start">
                        by <a href="https://github.com/robbsnor" target="_blank" class="hover:underline">Robbsnor</a>
                    </div>
                </div>
            </div>
        </Container>
    </div>
</template>
