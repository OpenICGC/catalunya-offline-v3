import { Capacitor } from '@capacitor/core';
import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import {inflate} from 'pako';
import maplibregl from 'maplibre-gl';

import hex2dec from './hex2dec';

applyPolyfills().then(() => {
  jeepSqlite(window);
});

const sqlite = new SQLiteConnection(CapacitorSQLite);
const query = 'SELECT HEX(tile_data) as tile_data_hex FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ? limit 1';

const init = (async () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    try {
      console.debug('[mbtiles] Initializing Offline Web Storage');
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
      console.debug('[mbtiles] Offline Web Storage initialized');
    } catch (err) {
      console.error('[mbtiles] Error initializing Offline Web Storage', err);
    }
  }
})();

const sourceDatabases = new Map();

const getTile = (url: string) => {
  const splitUrl = url.split('/');
  const dbName = splitUrl[2];
  const z = +splitUrl[splitUrl.length - 3];
  const x = +splitUrl[splitUrl.length - 2];
  const y = +(splitUrl[splitUrl.length - 1].split('.')[0]);

  return getTileFromDatabase(dbName, z, x, y);
};

const getTileFromDatabase = async (dbName: string, z: number, x: number, y: number) => {
  const db = await getDatabase(dbName);
  const params = [z, x, Math.pow(2, z) - y - 1];
  const queryresults = await db.query(query, params);
  if (queryresults.values.length === 1) { // Tile found
    let binData = await hex2dec(queryresults.values[0].tile_data_hex);
    if (binData[0] === 0x1f && binData[1] === 0x8b) { // is GZipped
      binData = inflate(binData);
    }
    return binData.buffer;
  }
};

const getDatabase = async (dbName: string) => {
  await init;
  if (!sourceDatabases.has(dbName)) {
    try {
      await sqlite.closeConnection(dbName, true);
    } catch {
      // Pos vale
    }
    console.debug(`[mbtiles] creating connection to ${dbName}`);
    sourceDatabases.set(dbName, sqlite
      .createConnection(dbName, false, 'no-encryption', 1, true)
      .then(async db => {
        console.debug(`[mbtiles] opening ${dbName}`);
        await db.open();
        console.debug(`[mbtiles] opened ${dbName}`);
        return db;
      })
    );
  }
  return sourceDatabases.get(dbName);
};

const mbtiles = (ml: typeof maplibregl) => {
  ml.addProtocol('mbtiles', (params, callback) => {
    getTile(params.url).then(tileBuffer => {
      if (tileBuffer) {
        callback(null, tileBuffer);
      } else {
        console.info(`[mbtiles] Tile not found: ${params.url}`);
        callback();
      }
    });
    return {
      cancel: () => undefined
    };
  });
};

const isMbtilesDownloaded = async (dbName: string) => {
  await init;
  const {result} = await sqlite.isDatabase(dbName);
  console.debug(`[mbtiles] Database ${dbName} is ${result ? '' : 'not '}downloaded`);
  return result;
};
const downloadMbtiles = async (url: string) => {
  await init;
  // TODO COF-5 Create a better download manager for Web (indexedDB) and Android/iOS, with progress
  await sqlite.getFromHTTPRequest(url, true).catch(err => console.error(err));
};

export {
  mbtiles,
  isMbtilesDownloaded,
  downloadMbtiles,
  getDatabase
};
