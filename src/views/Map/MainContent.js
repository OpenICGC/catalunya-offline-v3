import React, {useState} from 'react';
import PropTypes from 'prop-types';

import Map from '@geomatico/geocomponents/Map';

import {INITIAL_VIEWPORT} from '../../config';

const MainContent = ({mapStyle}) => {
  const [viewport, setViewport] = useState(INITIAL_VIEWPORT);

  return <Map
    mapStyle={mapStyle}
    viewport={viewport}
    onViewportChange={setViewport}
  />;
};

MainContent.propTypes = {
  mapStyle: PropTypes.string.isRequired
};

export default MainContent;
