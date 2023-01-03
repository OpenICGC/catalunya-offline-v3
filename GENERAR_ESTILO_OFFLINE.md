# Guía para generar un estilo offline

Assets de ejemplo en: `resources/example-offline-styles/mtc25m`


## Añadir en `config.ts`:

Añadir un nuevo `Basemap` en la constante `BASEMAPS`:

```javascript
{
  id: 'mtc25m',
  labels: {
    ca: 'Mapa Topogràfic 1:25 000',
    en: 'Topographic Map 1:25 000',
    es: 'Mapa Topográfico 1:25 000'
  },
  thumbnail: 'images/mtc25m.png',
  onlineStyle: 'mapstyles/mtc25m-online.json',
  offlineAssets: 'https://cdn.geomatico.es/datasets/mtc25m/assets.json'
}
```

Nótese que para que un estilo sea offline, tiene que tener declarado `offlineAssets` apuntando a un `assets.json`.

## `assets.json`:

```json lines
{
  "version": "1.0.0", //usado para comparar versiones entre publicado y descargado en dispositivo 
  "date": "2022-12-14T10:57:32Z", //fecha de publicación
  "style": "https://cdn.geomatico.es/datasets/mtc25m/mtc25m-offline.json", //estilo
  "mbtiles": [{ //array de mbtiles
    "id": "mtc25mcatoff", //identificador
    "url": "https://cdn.geomatico.es/datasets/mtc25m/mtc25mcat.mbtiles" //url del fichero. Es importante que el nombre del fichero coincida con cómo se declara el source en el estilo.
  }],
  "glyphs": "https://cdn.geomatico.es/datasets/mtc25m/glyphs.zip",
  "sprites": "https://cdn.geomatico.es/datasets/mtc25m/sprites.zip"
}
```

Tanto glyphs como sprites no son obligatorias, de hecho en el estilo dentro de resources no existe sprites.


## `style.json`:

```json lines
"sources": {
    "mtc25mcatoff": {
      "type": "vector",
      "tiles": [
        "mbtiles://mtc25m/{z}/{x}/{y}.pbf"
      ],
      "maxzoom": 13,
      "attribution": "Mapa CC-BY <a href='https://www.icgc.cat'>Institut Cartogràfic i Geològic de Catalunya</a>"
    }
},
"glyphs": "glyphs/{fontstack}/{range}.pbf",
"sprite": "sprites/{fontstack}/{range}.pbf",
```
