import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'nl.malmaarmals.app',
    appName: 'MalMaarMals',
    webDir: 'dist',
    server: {
        androidScheme: 'https',
        hostname: 'www.malmaarmals.nl',
    },
    android: {
        adjustMarginsForEdgeToEdge: 'disable',
    } as any,
};

export default config;