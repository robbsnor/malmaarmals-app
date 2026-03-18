<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div v-if="route.meta.showFooter !== false" class="border-t border-black-400">
        <Container>
            <div class="flex flex-col gap-5 justify-center items-center py-10">
                <div class="inline-grid grid-cols-[1fr_auto_1fr] gap-1 items-center text-muted-more">
                    <div class="place-self-end">Made with</div>

                    <v-icon icon="mdi-heart-outline" class="text-primary animate-pulse -mt-1 mx-1" />

                    <div class="self-start">
                        by <a href="https://github.com/robbsnor" target="_blank" class="hover:underline">Robbsnor</a>
                    </div>
                </div>

                <a
                    href="https://github.com/robbsnor/malmaarmals-app"
                    target="_blank"
                    class="text-muted-more hover:text-primary hover:scale-110"
                >
                    <v-icon>mdi-github</v-icon>
                </a>
            </div>
        </Container>
    </div>
</template>
