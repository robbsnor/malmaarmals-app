import { useBreakpoints } from '@vueuse/core';

export const breakpoints = useBreakpoints({
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
    '4xl': 2240,
    '5xl': 2560,
});
