import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS, MBTILES} from '../../config';
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

const MainContent = ({mapStyle}) => {
  const mapRef = useRef();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const [mbtilesStatus, setMbtilesStatus] = useState(CHECKING);
  const {geolocation} = useBackgroundGeolocation();

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
    if (latitude && longitude && mapRef.current) {
      mapRef.current.getSource('geolocation').setData({
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }]
      });
      setViewport({
        ...viewport,
        latitude,
        longitude,
        zoom: MAP_PROPS.maxZoom
      });
    }
  }, [geolocation, mapRef.current]);

  return mbtilesStatus === READY ?
    <Map
      {...MAP_PROPS}
      ref={mapRef}
      mapStyle={mapStyle}
      sources={sources}
      layers={layers}
      viewport={viewport}
      onViewportChange={setViewport}
    >
      <FabButton isLocationAvailable={true}/>
    </Map> : <div>
      {mbtilesStatusMessages[mbtilesStatus]}
    </div>;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired
};

export default MainContent;
