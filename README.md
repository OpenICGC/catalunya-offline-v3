# Catalunya Offline v2


## Setup development environment

### Javascript

1. Install `nodejs` and `npm` (tested with node 16 and npm 8 versions).
2. Install javascript dependencies with `npm i`.

Some relevant dependencies are:

 * Capacitor 4
 * React 17
 * MUI 5
 * MapLibre GL JS 2
 * react-map-gl 7

### Android

* Install OpenJDK 11: `sudo apt install openjdk-11-jdk-headless`
* Follow the "Environment Setup > Android Requirements" section from Capacitor documentation:
   https://capacitorjs.com/docs/getting-started/environment-setup#android-requirements
  * Install Android-Studio.
  * Start Android-Studio and install API 24, which corresponds to Android 7.0 Nougat, the lowest version to be compatible with.
* Install a virtual device (emulator) with a Nougat (API 24) image to test against following Android Studio documentation:
   https://developer.android.com/studio/run/managing-avds
* Add the following env vars to `~/.profile`:

  ```
  export CAPACITOR_ANDROID_STUDIO_PATH=$HOME/.local/share/JetBrains/Toolbox/scripts/studio # ...or wherever android studio was installed
  export ANDROID_SDK_ROOT=$HOME/Android/Sdk
  export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
  ```

### iOS

[TBD]


## Offline datasets

Offline dataset was downloaded from `http://betaserver.icgc.cat/mapicc/catoff_vt.zip`.

Offline asset publishing and setup is explained in `GENERAR_ESTILO_OFFLINE.md`.

The ADB command to explore the App filesystem in Android is:

```bash
adb shell run-as cat.icgc.catofflinev2 ls -lha /data/user/0/cat.icgc.catofflinev2/files/offlineData/mtc25m/1.0.0
```

## Run in develompment mode

### Web

* Storybook (dev): `npm run storybook`.
* Web version (dev): `npm start`.

### Android

Note: To be able to run on a real device,
[enable USB Debugging Mode](https://developer.android.com/studio/debug/dev-options) and use a cable.

#### Debugging the web code

To run in "auto-reload" mode, first run:

```bash
npm start
```

And, once the web is loaded in your browser:

```bash
npm run start:android
```

to load it into a device or emulator. Web contents will be served remotely from the 
laptop and auto-reloaded as in the web version.

To open a remote Javascript debugging console, go to `chrome://inspect#devices` in
your laptop's Chrome browser.

#### Debugging the native parts

If something wrong happens at native level (not javascript), use logcat to inspect device's logs: 

* Logs can be seen via `adb logcat`.
* If more than one device attached, specify via `-s` option. The attached devices can be listed with `adb devices`.
* Logs can be very verbose, but logcat can filter them at warning `*:W` or error `*:E` level.

A complete logcat command could be: `adb -s emulator-5554 logcat *:E` (show the error messages for a specific emulator).


### iOS

[TBD]


## Building and deploying for production

### Android Studio

Use the command `npm run build:android`, to build for production and open the project in
Android Studio.


### Xcode

[TBD]


## Multilanguage

We use **i18next** framework to localize our components:

- Web: [https://www.i18next.com/](https://www.i18next.com/)
- React integration: [https://react.i18next.com/](https://react.i18next.com/)

Usage example on functional component:

```jsx
import { useTranslation } from 'react-i18next';

const FunctionalComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>
}
```

The applied language will be determined by:

1. The `lang` query string. For instance, use [http://localhost:8080/?lang=es](http://localhost:8080/?lang=es).
2. The browser language preferences.
3. If detection fails, will default to `es`.

There are other detection strategies available, see
[https://github.com/i18next/i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector).

## License

Copyright (c) 2023 GeoStart (MIT License)  
See LICENSE file for more info.
