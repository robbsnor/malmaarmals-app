<script setup lang="ts"></script>

<template>
    <div class="fixed h-1/2 w-full bg-black pointer-events-none -z-100">
        <Container class="relative h-full">
            <div class="flex gap-4 absolute right-0 translate-x-1/6 h-full">
                <div
                    v-for="i in 3"
                    :key="i"
                    class="w-80 h-full pr-[1px] bg-gradient-to-br from-black to-primary/80 -skew-x-25"
                >
                    <div class="w-full h-full bg-gradient-to-br from-black to-black/20"></div>
                </div>
            </div>
        </Container>

        <div
            class="absolute inset-0 bg-gradient-to-b from-transparent via-30% via-black/80 lg:via-black/20 to-black-100"
        ></div>
    </div>
</template>
