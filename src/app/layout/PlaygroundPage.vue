<template>
    <div class="bg-red-300 h-full flex flex-col">
        <div class="bg-green">First div</div>

        <div class="bg-blue-300 overflow-auto h-full relative">
            <div class="absolute inset-0 overflow-auto">
                <div v-for="index in 100" :key="index" class="p-2">Item {{ index }}</div>
            </div>
        </div>
    </div>
</template>
