import { Capacitor } from '@capacitor/core';
import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import {inflate} from 'pako';


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
})();

const sourceDatabases = new Map();

const getTile = url => {
  let splitUrl = url.split('/');
  let dbName = splitUrl[2];
  let z = +splitUrl[splitUrl.length - 3];
  let x = +splitUrl[splitUrl.length - 2];
  let y = +(splitUrl[splitUrl.length - 1].split('.')[0]);

  return getTileFromDatabase(dbName, z, x, y);
};

const getTileFromDatabase = async (dbName, z, x, y) => {
  let db = await getDatabase(dbName);
  let params = [z, x, Math.pow(2, z) - y - 1];
  let queryresults = await db.query(query, params);
  if (queryresults.values.length === 1) { // Tile found
    let binData = await hex2dec(queryresults.values[0].tile_data_hex);
    if (binData[0] === 0x1f && binData[1] === 0x8b) { // is GZipped
      binData = inflate(binData);
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

const mbtiles = maplibregl => {
  maplibregl.addProtocol('mbtiles', (params, callback) => {
    getTile(params.url).then(tileBuffer => {
      if (tileBuffer) {
        callback(null, tileBuffer);
      } else {
        let message = `[mbtiles] Tile not found: ${params.url}`;
        callback(new Error(message));
      }
    });
    return {
      cancel: () => {}
    };
  });
};

const isMbtilesDownloaded = async dbName => {
  await init;
  const {result} = await sqlite.isDatabase(dbName);
  console.log(`[mbtiles] Database ${dbName} is ${result ? '' : 'not '}downloaded`);
  return result;
};
const downloadMbtiles = async url => {
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
