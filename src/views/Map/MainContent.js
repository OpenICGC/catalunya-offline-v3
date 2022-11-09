import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS, MBTILES, MIN_TRACKING_ZOOM} from '../../config';
import {mbtiles, isMbtilesDownloaded, downloadMbtiles, getDatabase} from '../../utils/mbtiles';
import useBackgroundGeolocation from '../../hooks/useBackgroundGeolocation';
import FabButton from '../../components/buttons/FabButton';

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
    'circle-radius':  [
      'interpolate',
      ['exponential', 2],
      ['zoom'],
      7, // Beware: this formula works only for latitudes around initial viewport's latitude
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 7]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI/180))],
      15,
      ['/', ['*', ['get', 'accuracy'], ['^', 2, 15]], 156543.03 * Math.cos(INITIAL_VIEWPORT.latitude * (Math.PI/180))]
    ],
    'circle-stroke-color': '#4286f5',
    'circle-stroke-opacity': 0.67,
    'circle-stroke-width': 1,
    'circle-pitch-alignment': 'map'
  }
},{
  id: 'geolocation',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': '#4285f4',
    'circle-opacity': 0.8,
    'circle-radius': 10,
    'circle-stroke-color': '#FFF',
    'circle-stroke-opacity': 0.8,
    'circle-stroke-width': 2,
    'circle-pitch-alignment': 'map'
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

const MainContent = ({mapStyle, manager, onManagerChanged}) => {
  const mapRef = useRef();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mbtilesStatus, setMbtilesStatus] = useState(CHECKING);

  const {geolocation, error: geolocationError} = useBackgroundGeolocation();
  const orientation = -45; // TODO provide an orientation service

  const [isNavigationMode, setNavigationMode] = useState();
  const toggleNavigationMode = () => setNavigationMode(!isNavigationMode);

  const [isTrackingMode, setTrackingMode] = useState(true);
  const enableTracking = () => setTrackingMode(true);
  const disableTracking = () => setTrackingMode(false);


  // Effects on offline tileset downloading
  useEffect(() => {
    isMbtilesDownloaded(MBTILES.dbName).then(isDownloaded => {
      if (isDownloaded) {
        setMbtilesStatus(AVAILABLE);
      } else {
        downloadMbtiles(MBTILES.downloadMbtilesUrl).then(() => setMbtilesStatus(AVAILABLE));
        setMbtilesStatus(DOWNLOADING);
      }
    });
  }, []);

  useEffect(() => {
    if (mbtilesStatus === AVAILABLE) {
      getDatabase(MBTILES.dbName).then(() => setMbtilesStatus(READY));
      setMbtilesStatus(OPENING);
    }
  }, [mbtilesStatus]);

  // Set blue dot location on geolocation updates
  useEffect(() => {
    const {latitude, longitude} = geolocation;
    if (mapRef.current) {
      mapRef.current.once('idle', () => {
        mapRef.current.getSource('geolocation').setData({
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
      });
    }
  }, [geolocation, mapRef.current, mapStyle]);

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
      mapRef.current ?
        mapRef.current.easeTo({
          center: [longitude, latitude],
          ...bearingZoom
        }) :
        setViewport({
          ...viewport,
          latitude,
          longitude,
          ...bearingZoom
        });
    }
  }, [isTrackingMode, geolocation, orientation]);

  const changeManager = clicked => onManagerChanged(clicked === manager ? undefined : clicked);

  return mbtilesStatus === READY ?
    <Map
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
    </Map> : <div>
      {mbtilesStatusMessages[mbtilesStatus]}
    </div>;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  manager: PropTypes.oneOf(['LAYERS', 'BASEMAPS', 'SCOPES']),
  onManagerChanged: PropTypes.func.isRequired
};

export default MainContent;
