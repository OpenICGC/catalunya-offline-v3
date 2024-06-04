# Catalunya Offline

[![Frontend tests](https://github.com/OpenICGC/catalunya-offline-v3/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/OpenICGC/catalunya-offline-v3/actions/workflows/test-frontend.yml)

## Informació

</div>
<p><strong>Catalunya Offline</strong> és una aplicació mòbil que us permet explorar el territori català, marcar punts d'interès i enregistrar les vostres rutes i excursions utilitzant el GPS, fins i tot en el cas que no hi hagi cobertura de dades al vostre dispositiu mòbil.</p><p>L'aplicació també permet la descàrrega i la visualització de la cartografia topogràfica de l'ICGC, que presenta la informació estructurada i jerarquitzada per facilitar-ne la lectura. S'hi mostren les corbes de nivell i informació relativa als senders de muntanya.</p>
        </div>

<div style="text-align: center;">
  <img src="https://icgc-web-pro.s3.eu-central-1.amazonaws.com/produccio/s3fs-public/styles/ezpublish_large/public/2024-05/catoffline_fig02.jpg?itok=Qw_a7U4-" width="149" height="300" alt="Captura de pantalla que mostra l’estil de lleure, amb la funcionalitat de localització de l’usuari damunt del mapa activada" title="Captura de pantalla que mostra l’estil de lleure, amb la funcionalitat de localització de l’usuari damunt del mapa activada"/>
</div>

<div style="text-align: center;">
  <a href="https://www.icgc.cat/" target="_blank">
    <img src="https://tilemaps.icgc.cat/cdn/logos/ICGC_color_norma.svg" alt="ICGC Logo" width="150">
  </a>
</div>

<hr>



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

* Install Xcode
* Install **Xcode Command Line Tools**: `xcode-select --install`
* Install Homebrew: `$ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
  * In my case I needed to install `cocoapods`: `brew install cocoapods`


## Configure sentry

Sentry will keep track of errors occurring in real devices so we can be aware and eventuallu fix them.
In order to have sentry up and running, please configure propperly adding the required information to the `.env` file:

```dotenv
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```


## Inspect offline assets

The ADB command to explore the App filesystem in Android is:

```bash
adb shell run-as cat.icgc.catofflinev3 ls -lha /data/user/0/cat.icgc.catofflinev3/files/offlineData
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

#### Debugging the web code

To run in "auto-reload" mode, first run:

```bash
npm start
```

And, once the web is loaded in your browser:

```bash
npm run start:ios
```

to load it into a device or emulator. Web contents will be served remotely from the 
laptop and auto-reloaded as in the web version.

To open a remote Javascript debugging console, open safari, development, and select your iphone.


## Building and deploying for production

### Tagging a new version abd making a release

* Note which is the current version, either in `package.json` or the 'about' dialog in the application.
* Decide a new version number. As this is not a library with a public API, we don't need to follow SEMVER. But, in general:
  * correcting bugs would increase the 3rd number (patch version),
  * adding new relevant functionalities would increase the 2nd number (minor version), and
  * a significant rewrite would increase tne 1st number (major version).
* Use the command `npm version <version_number>`. This will tag the Web and propagate automatically the new version number to Android and iOS projects.
* Push the changes to git.
* Follow the next steps for Android Studio or Xcode.


### Android Studio

Use the command `npm run build:android`, to build for production and open the project in Android Studio.


### Xcode

* Use the command `npm run build:ios`, to open the project in Xcode.
* In Xcode:
  * Product > Archive
  * In the Archives panel press `Distribute app` button:
    * It'll validate the builded app and push to app store, without publising it.


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


## Preparing datasets and styles

The base URL for accessing resources is defined in `src/config.ts`, in the `BASE_URL` const.

The application expects to find the following resources in `BASE_URL`:

* Two mbtiles files for offline usage named:
  * `openmaptiles.mbtiles` base cartography (vector tiles following OpenMapTiles schema), and
  * `terrain.mbtiles` in terrain-rgb format.
* A `glyphs.zip` file that will be used offline. Glyphs are shared across all styles, make sure to include all used typographies here.
* For each map style ('estandard' and 'lleure' at the time of writing):
  * The map style definition file (for instance, `estandard.json` or `lleure.json`). This will be used verbatim in online mode, so make sure URLs for sources, sprites and glyphs point to publicly available services. In offline mode, these URLS will be rewritten to point to the locally downloaded versions. Please keep the source id's untouched.
  * The thumbnail to be displayed in style switcher (for example, `thumbnail-estandard.png'). It is expected to be in `png` format.
  * A zip file containing the sprites for the style (for example, `sprites-estandard.zip`).

You can find a copy of the actual published sprites, glyphs, thumbnails and styles (that is, all resources except for mbtiles, for weight reasons) in the `resources/example-styles/official/` folder. We highly recommend to keep these sample resources in sync with the ones published in production, as backup and for reference.


## License

Copyright (c) 2024 GeoStart (MIT License)
See LICENSE file for more info.
