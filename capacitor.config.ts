import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.robinnoppert.malmaarmals.test',
  appName: 'MalMaarMals',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;