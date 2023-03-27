import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import maplibregl from 'maplibre-gl';

import {IS_WEB} from '../config';

applyPolyfills().then(() => {
  jeepSqlite(window);
});

const decodeTileWorker = new Worker(new URL('./decodeTileWorker.js', import.meta.url));

const sqlite = new SQLiteConnection(CapacitorSQLite);
const query = 'SELECT HEX(tile_data) as tile_data_hex FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ? limit 1';

const init = (async () => {
  if (IS_WEB) {
    try {
      //console.debug('[mbtiles] Initializing Offline Web Storage');
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
      //console.debug('[mbtiles] Offline Web Storage initialized');
    } catch (err) {
      console.error('[mbtiles] Error initializing Offline Web Storage', err);
    }
  }
})();

const sourceDatabases = new Map();

const getTile = (url: string) => {
  const splitUrl = url.split('/');
  const dbName = splitUrl[2] + '.mbtiles';
  const uri = Array.from(sourceDatabases.keys()).find(db => db.endsWith(dbName));
  const z = +splitUrl[splitUrl.length - 3];
  const x = +splitUrl[splitUrl.length - 2];
  const y = +(splitUrl[splitUrl.length - 1].split('.')[0]);

  return getTileFromDatabase(uri, z, x, y);
};

const getTileFromDatabase = async (dbName: string, z: number, x: number, y: number) => {
  const db = await getDatabase(dbName);
  const params = [z, x, Math.pow(2, z) - y - 1];
  const queryresults = await db.query(query, params);
  if (queryresults.values.length === 1) { // Tile found
    const channel = new MessageChannel();
    decodeTileWorker.postMessage(queryresults.values[0].tile_data_hex, [channel.port2]);
    return await new Promise((resolve) => channel.port1.onmessage = (e) => {
      resolve(e.data.buffer);
    });
  }
};

const getDatabase = async (dbName: string) => {
  await init;
  if (IS_WEB) {
    if (!sourceDatabases.has(dbName)) {
      try {
        await sqlite.closeConnection(dbName, true);
      } catch {
      // Pos vale
      }
      //console.debug(`[mbtiles] creating connection to ${dbName}`);
      sourceDatabases.set(dbName, sqlite
        .createConnection(dbName, false, 'no-encryption', 1, true)
        .then(async db => {
          //console.debug(`[mbtiles] opening ${dbName}`);
          await db.open();
          //console.debug(`[mbtiles] opened ${dbName}`);
          return db;
        })
      );
    }
  } else {
    if (!sourceDatabases.has(dbName)) {
      try {
        await sqlite.closeNCConnection(dbName);
      } catch {
      // Pos vale
      }
      //console.debug(`[mbtiles] creating connection to ${dbName}`);
      //console.log(sqlite.isDatabase(dbName));
      sourceDatabases.set(dbName, sqlite
        .createNCConnection(dbName, 1)
        .then(async db => {
          //console.debug(`[mbtiles] opening ${dbName}`);
          await db.open();
          //console.debug(`[mbtiles] opened ${dbName}`);
          return db;
        })
      );
    }
  }
  
  return sourceDatabases.get(dbName);
};

const mbtiles = (ml: typeof maplibregl) => {
  ml.addProtocol('mbtiles', (params, callback) => {
    getTile(params.url).then(tileBuffer => {
      if (tileBuffer) {
        callback(null, tileBuffer);
      } else {
        //console.info(`[mbtiles] Tile not found: ${params.url}`);
        callback();
      }
    });
    return {
      cancel: () => undefined
    };
  });
};

export {
  mbtiles,
  getDatabase
};
