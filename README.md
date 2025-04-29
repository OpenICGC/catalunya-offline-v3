# Catalunya Offline

[![Frontend tests](https://github.com/OpenICGC/catalunya-offline-v3/actions/workflows/test-frontend.yml/badge.svg)](https://github.com/OpenICGC/catalunya-offline-v3/actions/workflows/test-frontend.yml)

## Informació

<p><strong>Catalunya Offline</strong> és una aplicació mòbil que us permet explorar el territori català, marcar punts d'interès i enregistrar les vostres rutes i excursions utilitzant el GPS, fins i tot en el cas que no hi hagi cobertura de dades al vostre dispositiu mòbil.</p>

<p>L'aplicació també permet la descàrrega i la visualització de la cartografia topogràfica de l'ICGC, que presenta la informació estructurada i jerarquitzada per facilitar-ne la lectura. S'hi mostren les corbes de nivell i informació relativa als senders de muntanya.</p>

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

1. Install nodejs and npm (tested with node 16 and npm 8 versions).
2. Install javascript dependencies with `npm i`.

Some relevant dependencies are:

 * Capacitor 6 (node 18+)
 * React 17
 * MUI 5
 * MapLibre GL JS 2
 * react-map-gl 7

### Android

* Install OpenJDK 11: `sudo apt install openjdk-11-jdk-headless`
* Follow the "Environment Setup > Android Requirements" section from Capacitor documentation:
   [Capacitor Android Requirements](https://capacitorjs.com/docs/getting-started/environment-setup#android-requirements)
  * Install Android Studio.
  * Start Android Studio and install API 24 (Android 7.0 Nougat), which is the minimum version supported.
* Install a virtual device (emulator) with a Nougat (API 24) image to test against:
   [Managing AVDs - Android Docs](https://developer.android.com/studio/run/managing-avds)
* Add the following environment variables to `~/.profile`:

```bash
export CAPACITOR_ANDROID_STUDIO_PATH=$HOME/.local/share/JetBrains/Toolbox/scripts/studio # Or wherever Android Studio is installed
export ANDROID_SDK_ROOT=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools
```

#### Android Gradle Configuration (important!)

Ensure the file `android/build.gradle` contains the following configuration:

```groovy
allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

subprojects {
    tasks.withType(org.jetbrains.kotlin.gradle.tasks.KotlinCompile).configureEach {
        kotlinOptions {
            jvmTarget = '17'
        }
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
```

If you're rebuilding or redeploying the app, follow this workflow:

```bash
npm run build # Creates the dist folder
npm start
./android/gradlew --stop   # Only if gradle was running before
npm run start:android
```

This ensures that web assets are built and loaded into an Android emulator or device with live reloading enabled.

### iOS

* Install Xcode
* Install **Xcode Command Line Tools**: `xcode-select --install`
* Install Homebrew: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
  * In some cases you may need to install cocoapods: `brew install cocoapods`

## Configure sentry

Sentry will track errors occurring in real devices. To enable it, add the required information in `.env`:

```
SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

## Inspect offline assets

The ADB command to explore the app filesystem in Android is:

```bash
adb shell run-as cat.icgc.catofflinev3 ls -lha /data/user/0/cat.icgc.catofflinev3/files/offlineData
```

## Run in development mode

### Web

* Storybook (dev): `npm run storybook`
* Web version (dev): `npm start`

### Android

Note: To run on a real device,
[enable USB Debugging Mode](https://developer.android.com/studio/debug/dev-options) and use a cable.

#### Debugging the web code

To run in "auto-reload" mode, first run:

```bash
npm start
```

And then:

```bash
npm run start:android
```

Web contents will be served remotely from your laptop and auto-reloaded as in the browser.

Open Chrome's remote debugging console at: `chrome://inspect#devices`

#### Debugging the native parts

For native issues, use logcat to inspect logs:

```bash
adb logcat *:E  # Show only error messages
```

Use `-s` to specify a specific device from `adb devices`.

### iOS

#### Debugging the web code

To run in "auto-reload" mode:

```bash
npm start
npm run start:ios
```

To open a remote JavaScript debugging console, use Safari → Develop → select your iPhone.

## Building and deploying for production

### Tagging a new version and making a release

* Check current version in `package.json` or app's "About" dialog.
* Decide new version number:
  * Patch: bug fixes
  * Minor: new features
  * Major: major rewrites
* Use `npm version <version_number>` — propagates version to Android and iOS projects.
* Push changes to git.
* Follow steps below for Android Studio or Xcode.

### Android Studio

Use the command:

```bash
npm run build:android
```

Then open the project in Android Studio.

### Xcode

* Use the command:

```bash
npm run build:ios
```

Then open the project in Xcode.
* In Xcode:
  * Product > Archive
  * In Archives panel, click Distribute App:
    * Validates and uploads to App Store without publishing.

## Multilanguage

We use **i18next** framework:

- Web: [https://www.i18next.com/](https://www.i18next.com/)
- React integration: [https://react.i18next.com/](https://react.i18next.com/)

Usage example:

```jsx
import { useTranslation } from 'react-i18next';

const FunctionalComponent = () => {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>
}
```

Language detection order:

1. `lang` query string like `http://localhost:8080/?lang=es`
2. Browser language preferences
3. Default fallback is `es`

See [i18next-browser-languageDetector](https://github.com/i18next/i18next-browser-languageDetector) for more strategies.

## Preparing datasets and styles

The base URL for resources is defined in `src/config.ts`, via `BASE_URL`.

Offline resources expected:

* Two mbtiles files:
  * `openmaptiles.mbtiles` (vector tiles, OpenMapTiles schema)
  * `terrain.mbtiles` (terrain-rgb format)
* `glyphs.zip` (contains all used fonts)
* For each map style ('standard' and 'lleure'):
  * Style definition JSON (`estandard.json`, `lleure.json`)
  * Thumbnail image (`thumbnail-estandard.png`)
  * Sprites ZIP archive (`sprites-estandard.zip`)

You can find published examples in `resources/example-styles/official/`. Keep these in sync with production versions for backup and easy reference.

## License

Copyright (c) 2024 Institut Cartogràfic i Geològic de Catalunya (MIT License)  
See LICENSE file for more info.