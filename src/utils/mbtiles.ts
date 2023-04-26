import {CapacitorSQLite, SQLiteConnection, SQLiteDBConnection} from '@capacitor-community/sqlite';
//import { defineCustomElements as jeepSqlite, applyPolyfills} from 'jeep-sqlite/loader';
import maplibregl from 'maplibre-gl';

//import {IS_WEB} from '../config';

/*applyPolyfills().then(() => {
  jeepSqlite(window);
});*/

const decodeTileWorker = new Worker(new URL('./decodeTileWorker.js', import.meta.url));

const sqlite = new SQLiteConnection(CapacitorSQLite);
const query = 'SELECT HEX(tile_data) as tile_data_hex FROM tiles WHERE zoom_level = ? AND tile_column = ? AND tile_row = ? limit 1';

/*const init = (async () => {
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
})();*/

let dbPaths: Record<string, string> = {};
const dbConnections: Map<string, SQLiteDBConnection> = new Map<string, SQLiteDBConnection>();

const getTile = (url: string) => {
  const splitUrl = url.split('/');
  const dbPath = dbPaths[splitUrl[2]];
  const z = +splitUrl[splitUrl.length - 3];
  const x = +splitUrl[splitUrl.length - 2];
  const y = +(splitUrl[splitUrl.length - 1].split('.')[0]);

  //console.debug('[mbtiles] getTile', dbPath, z, x, y);
  return getTileFromDatabase(dbPath, z, x, y);
};

const getTileFromDatabase = async (dbPath: string, z: number, x: number, y: number) => {
  const connection = dbConnections.get(dbPath);
  const params = [z, x, Math.pow(2, z) - y - 1];
  const queryresults = await connection?.query(query, params);
  if (queryresults?.values?.length === 1) { // Tile found
    const channel = new MessageChannel();
    decodeTileWorker.postMessage(queryresults.values[0].tile_data_hex, [channel.port2]);
    return await new Promise((resolve) => channel.port1.onmessage = (e) => {
      resolve(e.data.buffer);
    });
  }
};

const openConnection = async (dbName: string) => {
  const connection = await sqlite.createNCConnection(dbName, 1);
  //console.log('[mbtiles] Opening...');
  await connection.open();
  //console.log('[mbtiles] Opened...');
  dbConnections.set(dbName, connection);
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

const setDbPaths = async (paths: Record<string, string>) => {
  await Promise.all(Object.values(dbPaths).map(path => sqlite.closeNCConnection(path))); // Close old connections
  // console.log('[mbtiles] All connections closed');
  dbPaths = paths;
  await Promise.all(Object.values(dbPaths).map(path =>
    openConnection(path)
      .catch((reason) => {
        if (!reason.message.includes('already exists')) { // If it was already opened, should be fine
          console.error('[mbtiles] Connection to', path, 'not opened, reason is', reason);
        }
      })
  ));
};

export {
  mbtiles,
  setDbPaths
};
