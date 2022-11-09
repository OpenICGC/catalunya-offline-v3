import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS, MBTILES, MIN_TRACKING_ZOOM} from '../../config';
import {mbtiles, isMbtilesDownloaded, downloadMbtiles, getDatabase} from '../../utils/mbtiles';
import useBackgroundGeolocation from '../../hooks/useBackgroundGeolocation';
import FabButton from '../../components/FabButton';

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
  id: 'geolocation',
  source: 'geolocation',
  type: 'circle',
  paint: {
    'circle-color': '#FF00FF',
    'circle-opacity': 1,
    'circle-radius': 6,
    'circle-stroke-color': '#FFF',
    'circle-stroke-opacity': 1,
    'circle-stroke-width': 2,

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

const MainContent = ({mapStyle, onManagerChanged}) => {
  const mapRef = useRef();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mbtilesStatus, setMbtilesStatus] = useState(CHECKING);
  const [isTrackingMode, setTrackingMode] = useState(true);
  const {geolocation, error: geolocationError} = useBackgroundGeolocation();

  const orientation = -45; // TODO provide an orientation service

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

  useEffect(() => {
    const {latitude, longitude} = geolocation;
    if (mapRef.current) {
      mapRef.current.getSource('geolocation').setData({
        type: 'FeatureCollection',
        features: latitude && longitude ? [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }] : []
      });
    }
  }, [geolocation, mapRef.current]);

  // Navigation
  const [isNavigationMode, setNavigationMode] = useState(false);
  const toggleNavigationMode = () => setNavigationMode(!isNavigationMode);
  useEffect(() => {
    mapRef.current?.easeTo({
      pitch: isNavigationMode ? 60 : 0,
      bearing: isNavigationMode && isTrackingMode ? orientation : 0,
    });
  }, [isNavigationMode]);
  useEffect(() => {
    if (isNavigationMode && isTrackingMode) {
      mapRef.current?.easeTo({
        pitch: isNavigationMode ? 60 : 0,
        bearing: orientation
      });
    }
  }, [isNavigationMode, isTrackingMode, orientation]);

  // Tracking
  const enableTracking = () => setTrackingMode(true);
  const disableTracking = () => {
    setTrackingMode(false);
  };
  useEffect(() => {
    const {latitude, longitude} = geolocation;
    isTrackingMode && latitude && longitude &&
    (mapRef.current ? mapRef.current.easeTo({
      latitude,
      longitude,
      zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom),
      bearing: isNavigationMode ? orientation : 0
    }) : setViewport({
      ...viewport,
      latitude,
      longitude,
      zoom: Math.max(MIN_TRACKING_ZOOM, viewport.zoom),
      bearing: isNavigationMode ? orientation : 0
    }));
  }, [geolocation, isTrackingMode]);

  const setLayersManager = () => onManagerChanged('LAYERS');
  const setBaseMapsManager = () => onManagerChanged('BASEMAPS');
  const setFoldersManager = () => onManagerChanged('SCOPES');

  return mbtilesStatus === READY ?
    <Map
      {...MAP_PROPS}
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
        onLayersClick={setLayersManager}
        onBaseMapsClick={setBaseMapsManager}
        onFoldersClick={setFoldersManager}
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
