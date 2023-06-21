import {load, parse} from '@loaders.gl/core';
import {ZipLoader} from '@loaders.gl/zip';
import {DBFLoader, SHPLoader} from '@loaders.gl/shapefile';
import {binaryToGeometry, transformGeoJsonCoords} from '@loaders.gl/gis';
import {Proj4Projection} from '@math.gl/proj4';

import {IGeodataLoader} from './types';
import {DBFRowsOutput} from '@loaders.gl/shapefile/src/lib/parsers/types';
import {BinaryGeometry} from '@loaders.gl/schema';
import {SHPHeader} from '@loaders.gl/shapefile/src/lib/parsers/parse-shp-header';
import GeoJSON from 'geojson';

const ESRI_WGS84 = 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]';

const byExtension = (fileMap: Record<string, ArrayBuffer>): Record<string, ArrayBuffer> =>
  Object.fromEntries(Object.entries(fileMap).map(
    ([filename, data]) => ([filename.split('.').pop()?.toLowerCase(), data])
  ));

const asString = (data: ArrayBuffer | undefined): string | undefined => data !== undefined ? new TextDecoder('utf-8').decode(data) : undefined;

function parseGeometries(geometries: Array<BinaryGeometry | null>): Array<GeoJSON.Geometry | null> {
  const geojsonGeometries: Array<GeoJSON.Geometry | null> = [];
  for (const geom of geometries) {
    geojsonGeometries.push(geom === null ? null : binaryToGeometry(geom));
  }
  return geojsonGeometries;
}

function joinProperties(geometries: Array<GeoJSON.Geometry | null>, properties: DBFRowsOutput): Array<GeoJSON.Feature<GeoJSON.Geometry>> {
  const features: Array<GeoJSON.Feature<GeoJSON.Geometry>> = [];
  for (let i = 0; i < geometries.length; i++) {
    const geometry = geometries[i];
    const feature: GeoJSON.Feature<GeoJSON.Geometry | null> = {
      type: 'Feature',
      geometry,
      // properties can be undefined if dbfResponse above was empty
      properties: (properties && properties[i]) || {}
    };
    feature.geometry !== null && features.push(feature as GeoJSON.Feature);
  }

  return features;
}

function reprojectFeatures(features: Array<GeoJSON.Feature>, sourceCrs?: string, targetCrs?: string): Array<GeoJSON.Feature> {
  if (!sourceCrs && !targetCrs) {
    return features;
  }

  const projection = new Proj4Projection({from: sourceCrs || 'WGS84', to: targetCrs || 'WGS84'});
  return transformGeoJsonCoords(features, (coord) => projection.project(coord)) as Array<GeoJSON.Feature>;
}

type SHPResult = {
  geometries: (BinaryGeometry | null)[];
  header?: SHPHeader;
  error?: string;
  progress: {
    bytesUsed: number;
    bytesTotal: number;
    rows: number;
  };
  currentIndex: number;
};

const ShpZipLoader: IGeodataLoader = {
  load: (url) => {
    return load(url, ZipLoader).then(fileMap => {
      const files = byExtension(fileMap);
      const cpg = asString(files.cpg);
      const prj = asString(files.prj);

      if (files.shp && files.dbf) {
        const shpPromise = parse(files.shp, SHPLoader, {worker: false});
        const dbfPromise = parse(files.dbf, DBFLoader, {worker: false, dbf: {encoding: cpg || 'latin1'}});
        return Promise.all([shpPromise, dbfPromise])
          .then(([shp, dbf]: [SHPResult, DBFRowsOutput]) => {
            const geojsonGeometries = parseGeometries(shp.geometries);
            let features = joinProperties(geojsonGeometries, dbf);
            if (prj && prj !== ESRI_WGS84) {
              features = reprojectFeatures(features, prj, 'WGS84');
            }
            return {
              type: 'FeatureCollection',
              features: features
            };
          });
      } else {
        return Promise.reject(Error('No .shp or .dbf files found in zip'));
      }
    });
  }
};

export default ShpZipLoader;
