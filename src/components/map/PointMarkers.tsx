import React, {FC} from 'react';
import {Marker} from 'react-map-gl';
import MarkerIcon from '@geomatico/geocomponents/components/MarkerIcon';
import {HEXColor, ScopePoint} from '../../types/commonTypes';
import {useSettings} from '../../hooks/useSettings';

const MARKER_SIZE = 32;
const ACCESSIBLE_MARKER_SIZE = 48;

const markerSx = {
  filter: 'drop-shadow(3px 3px 2px rgba(0,0,0,.5))'
};

export interface PointMarkersProps {
  points?: Array<ScopePoint>,
  defaultColor?: HEXColor,
  onClick?: (point: ScopePoint) => void
}

const PointMarkers: FC<PointMarkersProps> = ({
  points = [],
  defaultColor,
  onClick= () => undefined
}) => {

  const {isAccessibleSize} = useSettings();

  const markerSize = isAccessibleSize ? ACCESSIBLE_MARKER_SIZE : MARKER_SIZE;
  const visiblePoints = points?.filter(point => point.properties.isVisible);

  return <>{
    visiblePoints.map(point =>
      <Marker
        key={point.id}
        longitude={point.geometry.coordinates[0]}
        latitude={point.geometry.coordinates[1]}
        onClick={() => onClick(point)}
        anchor="bottom">
        <MarkerIcon
          color={point.properties?.color || defaultColor}
          size={markerSize}
          sx={markerSx}
        />
      </Marker>
    )
  }</>;
};

export default PointMarkers;
