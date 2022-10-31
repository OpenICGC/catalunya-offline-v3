import { Capacitor } from '@capacitor/core';
import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import * as pako from 'pako';

import hex2dec from './hex2dec';

applyPolyfills().then(() => {
  jeepSqlite(window);
});

let sqlite = new SQLiteConnection(CapacitorSQLite);
const query = 'SELECT HEX(tile_data) as tile_data_hex FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ? limit 1';

const init = (async () => {
  const platform = Capacitor.getPlatform();
  if (platform === 'web') {
    try {
      console.log('[mbtiles] Initializing Offline Web Storage');
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
      console.log('[mbtiles] Offline Web Storage initialized');
    } catch (err) {
      console.error('[mbtiles] Error initializing Offline Web Storage', err);
    }
  }
  let dbList = {values: []};
  try {
    dbList = await sqlite.getDatabaseList();
  } catch {
    console.log('[mbtiles] No databases found');
  }

  if (!dbList?.values.length) {
    console.log('[mbtiles] Copying databases from assets');
    try {
      await sqlite.copyFromAssets();
      console.log('[mbtiles] Databases copied from assets');
    } catch (error) {
      console.error('[mbtiles] Could not copy databases from assets');
    }
  }
})();

const sourceDatabases = new Map();

const getTile = url => {
  let splitUrl = url.split('/');
  let dbName = getSourceNameFromUrl(url);
  let z = +splitUrl[splitUrl.length - 3];
  let x = +splitUrl[splitUrl.length - 2];
  let y = +(splitUrl[splitUrl.length - 1].split('.')[0]);

  return getTileFromDatabase(dbName, z, x, y);
};

const getSourceNameFromUrl = url => {
  return url.replace('mbtiles://', '').split('/')[0];
};

const getTileFromDatabase = async (dbName, z, x, y) => {
  let db = await getDatabase(dbName);
  let params = [z, x, Math.pow(2, z) - y - 1];
  let queryresults = await db.query(query, params);
  if (queryresults.values.length === 1) { // Tile found
    let binData = hex2dec(queryresults.values[0].tile_data_hex);
    let isGzipped = binData[0] === 0x1f && binData[1] === 0x8b;
    if (isGzipped) {
      binData = pako.inflate(binData);
    }
    return binData.buffer;
  }
};

const getDatabase = async (dbName) => {
  await init;
  if (!sourceDatabases.has(dbName)) {
    try {
      await sqlite.closeConnection(dbName, true);
    } catch {
      // Pos vale
    }
    console.log(`[mbtiles] creating connection to ${dbName}`);
    sourceDatabases.set(dbName, sqlite
      .createConnection(dbName, false, 'no-encryption', 1, true)
      .then(async db => {
        console.log(`[mbtiles] opening ${dbName}`);
        await db.open();
        console.log(`[mbtiles] opened ${dbName}`);
        return db;
      })
    );
  }
  return sourceDatabases.get(dbName);
};

const addMbtilesProtocol = maplibregl => {
  maplibregl.addProtocol('mbtiles', (params, callback) => {
    getTile(params.url).then(tileBuffer => {
      if (tileBuffer) {
        callback(null, tileBuffer, null, null);
      } else {
        let message = `[mbtiles] Tile not found: ${params.url}`;
        callback(new Error(message));
      }
    });
    return {
      cancel: () => {
      }
    };
  });
};

export default addMbtilesProtocol;
