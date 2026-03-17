<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import ArchiveHeader from '../layout/components/ArchiveHeader.vue';
import { useElementSize } from '@vueuse/core';

const headerRef = useTemplateRef<HTMLElement>('headerRef');
const { height } = useElementSize(headerRef);
</script>

<template>
    <div :style="{ paddingTop: `${height}px` }">
        <ArchiveHeader ref="headerRef" />

        <RouterView />
    </div>
</template>
