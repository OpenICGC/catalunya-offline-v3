import { CapacitorConfig } from '@capacitor/cli';

const remoteDebug = process.env.LIVE_RELOAD_IP ? {
  url: `http://${process.env.LIVE_RELOAD_IP}:8080`,
  cleartext: true
} : {};

const config: CapacitorConfig = {
  appId: 'cat.icgc.catofflinev2',
  appName: ' Catalunya Offline v2',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    errorPath: 'unsupported.html',
    ...remoteDebug
  }
};

console.log('Capacitor Config:', config);

export default config;
