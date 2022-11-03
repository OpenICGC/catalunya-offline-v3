import React, {useEffect, useRef, useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS} from '../../config';
import addMbtilesProtocol from '../../utils/addMbtilesProtocol';
import useBackgroundGeolocation from '../../hooks/useBackgroundGeolocation';

addMbtilesProtocol(maplibregl);

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

const MainContent = ({mapStyle}) => {
  const mapRef = useRef();
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  const {geolocation} = useBackgroundGeolocation();

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

  return <Map
    {...MAP_PROPS}
    ref={mapRef}
    mapStyle={mapStyle}
    sources={sources}
    layers={layers}
    viewport={viewport}
    onViewportChange={setViewport}
  />;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired
};

export default MainContent;
