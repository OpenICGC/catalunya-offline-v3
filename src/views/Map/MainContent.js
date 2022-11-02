import React, {useEffect, useMemo, useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS} from '../../config';
import addMbtilesProtocol from '../../utils/addMbtilesProtocol';
import useBackgroundGeolocation from '../../hooks/useBackgroundGeolocation';

addMbtilesProtocol(maplibregl);

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
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);
  //const geolocation = useGeolocation();
  const {geolocation} = useBackgroundGeolocation();
  const {latitude, longitude} = geolocation;

  useEffect(() => {
    if (latitude && longitude && (latitude !== viewport.latitude || longitude !== viewport.longitude)) {
      setViewport({
        ...viewport,
        latitude,
        longitude,
        zoom: 14
      });
    }
  }, [latitude, longitude]);

  const sources = useMemo(() => ({
    'geolocation': {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: latitude && longitude ? [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [
                longitude,
                latitude
              ]
            }
          }
        ] : []
      }
    }
  }), [latitude, longitude]);

  return <Map
    {...MAP_PROPS}
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
