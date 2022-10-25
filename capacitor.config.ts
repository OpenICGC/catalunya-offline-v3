import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cat.icgc.catofflinev2',
  appName: ' Catalunya Offline v2',
  webDir: 'dist',
<<<<<<< HEAD
  bundledWebRuntime: false
=======
  bundledWebRuntime: false,
  server: {
    errorPath: 'unsupported.html'
  }
>>>>>>> fcafd8ae509716ea5b6be863df00055e6f3050a0
};

export default config;
