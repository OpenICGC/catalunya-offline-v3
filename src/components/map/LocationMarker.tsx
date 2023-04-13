import React, {FC} from 'react';
import {Marker} from 'react-map-gl';

import {Geolocation} from '../../hooks/singleton/useGeolocation';
import LocationMarkerIcon, {SIZE} from './LocationMarkerIcon';
import {HEXColor} from '../../types/commonTypes';

const STALE_TIMEOUT = 30; // Seconds

export interface LocationMarkerProps {
  color: HEXColor
  geolocation: Geolocation,
  heading?: number,
  headingAccuracy?: number
}

const LocationMarker: FC<LocationMarkerProps> = ({color, geolocation, heading, headingAccuracy}) => {
  const {latitude, longitude, timestamp} = geolocation;
  const isStale = timestamp ? Date.now() - timestamp > STALE_TIMEOUT * 1000 : true;
  if (latitude && longitude) {
    return <Marker
      latitude={latitude} longitude={longitude}
      style={{width: SIZE, height: SIZE}} anchor="center" pitchAlignment="map" rotationAlignment="map"
    >
      <LocationMarkerIcon heading={heading} headingAccuracy={headingAccuracy} isStale={isStale} color={color}/>
    </Marker>;
  } else {
    return null;
  }
};

export default React.memo(LocationMarker);
