import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.fountainpdl.fscode',
  appName: 'Fountain Studio Code',
  webDir: 'dist',
  server: {
    url: 'http://localhost:5173', // For live reload in dev
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;