import React, {useState} from 'react';
import PropTypes from 'prop-types';
import maplibregl from 'maplibre-gl';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT, MAP_PROPS} from '../../config';
import addMbtilesProtocol from '../../utils/addMbtilesProtocol';

addMbtilesProtocol(maplibregl);

const MainContent = ({mapStyle}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  return <Map
    {...MAP_PROPS}
    mapStyle={mapStyle}
    viewport={viewport}
    onViewportChange={setViewport}
  />;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired
};

export default MainContent;
