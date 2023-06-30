# Catalunya Offline v3. Manual per a desenvolupadors

En essència es tracta d'un desenvolupament frontend Javascript que s'encapsula i distrubueix com Apps natives gràcies a Capacitor. 

El codi ressideix a: https://github.com/OpenICGC/catalunya-offline-v2

Al README d'aquest repositori hi trobem com preparar l'entorn de treball i executar les tasques habituals. No les repetirem aquí.


## Dependències Javascript

Dependències per al desenvolupament i gestió:

* TypeScript
* Eslint
* Webpack 5
* Storybook
* Tests: Karma + chai + mocha
* Sentry

Frameworks i llibreries essencials:

* React 17
* Material UI 5 (mui)
* Maplibre 2


Llibreries auxiliars:

* Geocomponents: Components presentacionals per a visors de mapes. Documentació: https://labs.geomatico.es/geocomponents/
* Loaders.gl: Importació d'arxius CSV, GeoJSON, GPX, KML, SHP+ZIP.
* Turf: Operacions geomètriques.
* Pako: Descompressió en JS. Usat per a la lectura de tessel.les des de MBTiles.
* Moment: Gestió de dades i intervals temporals.
* Vega: Gràfiques.


## Capacitor

A més, es fa servir Capacitor v4 per:
1. Encapsular la web dins un projecte Android o iOS, de manera que es comporti com una App i es pugui compilar i distribuïr per a les diferents plataformes.
2. Accedir al hardware dels dispositius mitjançant plug-ins.

Moltes vegades hem trobat que els plugins oficials de capacitor són insuficients. En aquest cas hem buscat alternatives, primer, als plugins "community" de capacitor, després, a "capawesome", i per últim al vell conegut cordova, gracies al projecte "awesome-cordova-plugins".

En els moments d'escriure aquestes línies es fan servir els següents:

Plugins oficials:

* App: Permet saber si l'aplicació està en foreground o en background, permet optimitzar funcionament en background.
* Camera: Per tirar fotos o sel.leccionar-les de la galeria.
* Filesystem: Permet manipular el sistema de fitxers, utilitzat per gestionar les dades offline.
* Preferences: Es fa servir per a tota la persistència (settings, estat de l'aplicació, àmbits, capes d'usuari).
* Share: Per compartir un recurs amb qualsevol de les aplicacions instal.lades que el suportin (OneDrive, Google Drive, Telegram, ...).

Plugins community:

* Background-geolocation: Permet usar el GPS, també mentre l'aplicació està en segon pla.
* Network-react: Wrapper per al plugin oficial Network. Permet saber si estem offline, amb wifi o amb dades mòbils.
* Photoviewer
* SQLite

Plugins capawesome:

* Capacitor-file-picker: Permet importar fitxers des del dispositiu (capes d'usuari i àmbits).

Plugins awesome-cordova-plugins:

* Device-orientation: Per a la brúixola.
* File-transfer: Al gestor de descàrregues, permet desar fitxers binaris grans amb noció de progrés de descàrrega.
* Zip: Usat per descomprimir.

Altres:

* Capacitor-zip: És l'únic que ens ha permès comprimir en les dues plataformes.


## Organització general del codi

### Components presentacionals

Descriure característiques i repassar storybook


### Custom hooks

SingletonHooks


### Vistes


### Utils


### Specs


## Arquitectura de funcionalitats clau

### Entitats implicades en els Àmbits

<veure types/commonTypes scopes, tracks, points, schemas>


### Persistència

Tipus de persistència:

<explicar interfície>

  * localStoragePersistence: És ràpida, però volàtil. Bé per web, malament per mobils.
  * capacitorPersistence: Fa servir `@capacitor/preferences`. És confiable, però no està pensada per grans volums de dades, és lenta, i a cada plataforma fa servir una implementació diferent.
  * cachedPersistence: És un wrapper per a qualsevol altre tipus de persistència que desa els valors ja llegits a memòria. Altres instàncies que en facin ús la podran llegir molt més ràpidament.

#### usePersistedState

<explicar interfície>

* Pot haver-hi més d'una instància.
* La persistència és assíncrona i pot ser lenta.
 
Cal doncs una "via ràpida" per sincronitzar els valors entre diferents instàncies per no perdre la consistència.

Cicle de vida:
  * En muntar-se el hook, llegeix de la 'persistència'. Mentre no es llegeix, retorna un valor per defecte, i un isLoaded = false.
  * Quan s'ha llegit el valor de la 'persistència', es retorna el nou valor (react).
  * Quan es vol modificar el valor, passen dues coses:
    1. Via ràpida: Es notifica les altres possibles instàncies de que hi ha hagut un canvi via customEvent (propaga react).
    2. Via segura: Es demana a la 'persistència' que desi el valor.
  * També s'està escoltant els events per enterar-se ràpid de les modificacions.

#### Settings y persistedStates

Bàsicament usen usePersistedSate.

### usePersistedCollections

<explicar persistedCollectionInterface>

Exposa una API CRUD sobre col.leccions de dades persistides.

Es fa servir per a scopes, scopePoints, scopeTracks i userLayers.


### Loaders i Importers

<interfície loader>

ScopeImporter i UserLayerImporter

### Exportadors

Se explica la interfaz. Es un conversor de formato pero metido en un hook.
Se puede ver mirando las specs.


### Funcionament offline i gestor de descàrregues

BUF!
