import { Capacitor } from '@capacitor/core';
import {CapacitorSQLite, SQLiteConnection} from '@capacitor-community/sqlite';
import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import * as pako from 'pako';

applyPolyfills().then(() => {
  jeepSqlite(window);
});

let sqlite = new SQLiteConnection(CapacitorSQLite);

const init = (async () => {
  const platform = Capacitor.getPlatform();
  try {
    if (platform === 'web') {
      console.log('[mbtiles] Initializing Offline Web Storage');
      const jeepEl = document.createElement('jeep-sqlite');
      document.body.appendChild(jeepEl);
      await customElements.whenDefined('jeep-sqlite');
      await sqlite.initWebStore();
      console.log('[mbtiles] Offline Web Storage initialized');
    }
    let dbList = {values: []};
    try {
      await sqlite.getDatabaseList();
    } catch {
      // Couldn't read list => no dbs available
    }
    if (!dbList?.values.length) {
      console.log('[mbtiles] Copying databases from assets');
      await sqlite.copyFromAssets();
      console.log('[mbtiles] Databases copied from assets');
    }
  } catch (err) {
    console.log(`Error: ${err}`);
    throw new Error(`Error: ${err}`);
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
  // HEX(tile_data) as tile_data_hex,
  let queryresults = await db.query(
    'SELECT tile_data FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ? limit 1',
    params
  );
  if (queryresults.values.length === 1) { // Tile found
    //const hexData = queryresults.values[0].tile_data_hex;
    //let binData = new Uint8Array(hexData.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    let binData = queryresults.values[0].tile_data;
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
