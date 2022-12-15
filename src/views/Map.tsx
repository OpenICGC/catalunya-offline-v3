import React, {FC, useEffect, useRef, useState} from 'react';
import maplibregl from 'maplibre-gl';

import GeocomponentMap from '@geomatico/geocomponents/Map';

import {Manager} from '../types/commonTypes';
import {mbtiles, isMbtilesDownloaded} from '../utils/mbtiles';
import useBackgroundGeolocation, { Geolocation } from '../hooks/useBackgroundGeolocation';
import FabButton from '../components/buttons/FabButton';
import useCompass from '../hooks/useCompass';
import {INITIAL_VIEWPORT, MAP_PROPS, MBTILES, MIN_TRACKING_ZOOM, OFF_CAT} from '../config';
import DownloadsManager from '../components/downloads/DownloadsManager';

mbtiles(maplibregl);

const sources = {
  'geolocation': {
    type: 'geojson',
    data: {
      type: 'FeatureCollection',
      features: []
    }
  }
};

const layers = [{
  id: 'geolocation-precision',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': '#4286f5',
    'circle-opacity': 0.33,
    'circle-radius': [
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      7, // Beware: this formula works only for latitudes around initial viewport's latitude
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 7]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI / 180))],
      15,
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 15]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI / 180))]
    ],
    'circle-stroke-color': '#4286f5',
    'circle-stroke-opacity': 0.67,
    'circle-stroke-width': 1,
    'circle-pitch-alignment': 'map'
  }
}, {
  id: 'geolocation-shadow',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-radius': 17,
    'circle-blur': 0.7,
    'circle-translate': [1, 1],
    'circle-translate-anchor': 'viewport'
  }
}, {
  id: 'geolocation',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': '#4285f4',
    'circle-radius': 10,
    'circle-stroke-color': '#FFF',
    'circle-stroke-width': 2
  }
}];

const CHECKING = 0,
  DOWNLOADING = 1,
  AVAILABLE = 2,
  OPENING = 3,
  READY = 4;

const mbtilesStatusMessages = [
  'Checking mbtiles availability...',
  'Downloading mbtiles...',
  'Mbtiles downloaded',
  'Opening mbtiles...',
  'mbtiles ready'
];

export type MainContentProps = {
  mapStyle: string,
  manager: Manager,
  onManagerChanged: (newManager: Manager) => void
};

const Map: FC<MainContentProps> = ({mapStyle, manager, onManagerChanged}) => {
  const mapRef = useRef<maplibregl.Map>();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mbtilesStatus, setMbtilesStatus] = useState(CHECKING);

  const {geolocation, error: geolocationError} = useBackgroundGeolocation();
  const orientation = useCompass();

  const [isNavigationMode, setNavigationMode] = useState(false);
  const toggleNavigationMode = () => setNavigationMode(!isNavigationMode);

  const [isTrackingMode, setTrackingMode] = useState(true);
  const enableTracking = () => setTrackingMode(true);
  const disableTracking = () => setTrackingMode(false);

  // Effects on offline tileset downloading
  useEffect(() => {
    if (OFF_CAT) {
      setMbtilesStatus(READY);
      return;
    }
    isMbtilesDownloaded(MBTILES.dbName).then(isDownloaded => {
      if (isDownloaded) {
        setMbtilesStatus(AVAILABLE);
      } else {
        //downloadMbtiles(MBTILES.downloadMbtilesUrl).then(() => setMbtilesStatus(AVAILABLE));
        //downloadMbtilesBetter(MBTILES.downloadMbtilesUrl, (progress) => console.log(progress))
        //  .then(() => setMbtilesStatus(AVAILABLE));

        setMbtilesStatus(DOWNLOADING);
      }
    });
  }, []);

  /*useEffect(() => {
    if (mbtilesStatus === AVAILABLE && uri) {
      getDatabase(uri).then(() => setMbtilesStatus(READY));
      setMbtilesStatus(OPENING);
    }
  }, [mbtilesStatus]);*/

  // Set blue dot location on geolocation updates
  const setMapGeolocation = (map: maplibregl.Map | undefined, geolocation: Geolocation) => {
    const {latitude, longitude} = geolocation;
    const source = (map?.getSource('geolocation') as maplibregl.GeoJSONSource | undefined);
    source?.setData({
      type: 'FeatureCollection',
      features: latitude && longitude ? [{
        type: 'Feature',
        properties: {...geolocation},
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude]
        }
      }] : []
    });
  };

  useEffect(() => {
    setMapGeolocation(mapRef?.current, geolocation);
  }, [geolocation, mapRef.current]);

  useEffect(() => {
    mapRef.current?.once('styledata', () => setMapGeolocation(mapRef.current, geolocation));
  }, [mapStyle]);

  // Pitch & rotate map when switching navigation mode on/off
  useEffect(() => {
    mapRef.current?.easeTo({
      pitch: isNavigationMode ? 60 : 0,
      bearing: isNavigationMode && isTrackingMode ? orientation : 0,
    });
  }, [isNavigationMode]);

  // On tracking mode on, update viewport on location and orientation updates:
  // center, minimal zoom, and bearing if navigation mode is also on
  useEffect(() => {
    const {latitude, longitude} = geolocation;
    if (isTrackingMode && latitude && longitude) {
      const bearingZoom = {
        bearing: isNavigationMode && isTrackingMode ? orientation : 0,
        zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom)
      };
      /*mapRef.current ?
        mapRef.current.easeTo({
          center: [longitude, latitude],
          ...bearingZoom
        }) :*/
      setViewport({
        ...viewport,
        latitude,
        longitude,
        ...bearingZoom
      });
    }
  }, [isTrackingMode, geolocation, orientation]);

  const changeManager = (clicked: Manager) => {
    onManagerChanged(clicked === manager ? undefined : clicked);
  };

  return <GeocomponentMap
    {...MAP_PROPS}
    reuseMaps
    ref={mapRef}
    mapStyle={mapStyle}
    sources={sources}
    layers={layers}
    viewport={viewport}
    onViewportChange={setViewport}
    onDrag={disableTracking}
    onTouchMove={disableTracking}
    onWheel={disableTracking}
  >
    <FabButton
      isLeftHanded={false} isAccessibleSize={false}
      bearing={viewport.bearing} isCompassOn={isNavigationMode} onCompassClick={toggleNavigationMode}
      isLocationAvailable={!geolocationError} isTrackingOn={isTrackingMode} onTrackingClick={enableTracking}
      onLayersClick={() => changeManager('LAYERS')}
      onBaseMapsClick={() => changeManager('BASEMAPS')}
      onFoldersClick={() => changeManager('SCOPES')}
    />
  </GeocomponentMap>;
};

export default Map;
