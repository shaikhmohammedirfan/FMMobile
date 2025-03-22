import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fitnessmantra.app',
  appName: 'fitnessmantraMobile',
  webDir: 'dist/fitnessmantra-mobile',
  server: {
    androidScheme: 'https',
  },
};

export default config;
