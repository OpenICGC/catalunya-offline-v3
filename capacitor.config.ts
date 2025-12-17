import { CapacitorConfig } from '@capacitor/cli';

const remoteDebug = process.env.LIVE_RELOAD_IP ? {
  url: `http://${process.env.LIVE_RELOAD_IP}:8080`,
  cleartext: true
} : {};

const config: CapacitorConfig = {
  appId: 'cat.icgc.catofflinev3',
  appName: 'Catalunya Offline',
  webDir: 'dist',
  server: {
    errorPath: 'unsupported.html',
    androidScheme: 'http',
    ...remoteDebug
  },
  ios: {
    contentInset: 'always', //https://forum.ionicframework.com/t/ios-notch-safe-area-inconsistent-behavior/203053/3
    scheme: 'Catalunya Offline'
  },
  android: {
    useLegacyBridge: true, // Needed for backround-location plugin to keep working after 5 minutes
    adjustMarginsForEdgeToEdge: 'force'
  },
  plugins: {
    CapacitorSQLite: { // See https://github.com/capacitor-community/sqlite/issues/363
      androidIsEncryption: false,
      androidBiometric: {
        biometricAuth : false,
        biometricTitle : 'Biometric login for capacitor sqlite',
        biometricSubTitle : 'Log in using your biometric'
      },
    }
  }
};

console.log('Capacitor Config:', config);

export default config;
