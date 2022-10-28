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
* Add the following env vars to `~/.bashrc`:

  ```
  export CAPACITOR_ANDROID_STUDIO_PATH=$HOME/bin/android-studio/bin/studio.sh # ...or wherever android studio was installed
  export ANDROID_SDK_ROOT=$HOME/Android/Sdk
  export PATH=$PATH:~/Android/Sdk/platform-tools
  ```

### iOS

[TBD]


## Download Offline dataset

1. Get data file from `http://betaserver.icgc.cat/mapicc/catoff_vt.zip`.
2. Uncompress it into `static/catoff_vt/`.
3. Move the `static/catoff_vt/0.mbtiles` file to `satic/assets/databases/0SQLite.db`.


## Running on dev mode

### Web

* Storybook (dev): `npm run storybook`.
* Web version (dev): `npm start`.

### Android

* Android Studio project: `npm run build` + `npx cap sync` + `npx cap open android`
* Android on emulator or real device: `npm run build` + `npx cap sync` + `npx cap run android`

Note: To be able to run on a real device,
[enable USB Debugging Mode](https://developer.android.com/studio/debug/dev-options) and use a cable.

### iOS

[TBD]


## Multilanguage

We use **i18next** framework to localize our components:

- Web: [https://www.i18next.com/](https://www.i18next.com/)
- React integration: [https://react.i18next.com/](https://react.i18next.com/)

Usage example on functional component:

```js
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
