import React, {FC, useMemo} from 'react';
import {HEXColor} from '../../types/commonTypes';
import {GPS_POSITION_COLOR, GPS_POSITION_INACTIVE_COLOR} from '../../config';

function polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

type ArcOpts = {
  cx: number,
	cy: number,
	radius: number,
  start_angle: number,
  end_angle: number,
  thickness: number
}

const getArcD = (opts: ArcOpts) => {
  const start = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.end_angle);
  const end = polarToCartesian(opts.cx, opts.cy, opts.radius, opts.start_angle);
  const largeArcFlag = opts.end_angle - opts.start_angle <= 180 ? '0' : '1';

  const cutout_radius = opts.radius - opts.thickness;
  const start2 = polarToCartesian(opts.cx, opts.cy, cutout_radius, opts.end_angle);
  const end2 = polarToCartesian(opts.cx, opts.cy, cutout_radius, opts.start_angle);

  return [
    'M', start.x, start.y,
    'A', opts.radius, opts.radius, 0, largeArcFlag, 0, end.x, end.y,
    'L', opts.cx, opts.cy,
    'Z',

    'M', start2.x, start2.y,
    'A', cutout_radius, cutout_radius, 0, largeArcFlag, 0, end2.x, end2.y,
    'L', opts.cx, opts.cy,
    'Z'
  ].join(' ');
};

const DOT_STYLE = {
  filter: 'drop-shadow(0 0 4px rgba(0, 0, 0, .67))'
};
const SIZE = 100;
const DOT_RADIUS = 10;
const CENTER = SIZE / 2;

export interface LocationMarkerProps {
  bearing?: number,
  bearingAccuracy?: number,
  isStale?: boolean
}

const LocationMarker: FC<LocationMarkerProps> = ({
  bearing,
  bearingAccuracy= 45,
  isStale = false
}) => {
  const dotColor: HEXColor = isStale ? GPS_POSITION_INACTIVE_COLOR : GPS_POSITION_COLOR;

  const beam = useMemo(() => {
    if (bearing === undefined) {
      return null;
    } else {
      const beamProps = {
        cx: CENTER,
        cy: CENTER,
        radius: CENTER,
        start_angle: bearing - bearingAccuracy / 2,
        end_angle: bearing + bearingAccuracy / 2,
        thickness: CENTER - DOT_RADIUS
      };
      return <path d={getArcD(beamProps)} fill="url(#beamGradient)" fillRule="evenodd" />;
    }
  }, [bearing, bearingAccuracy, isStale]);

  const dot = <circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} stroke='#FFF' strokeWidth="2" style={DOT_STYLE} fill={dotColor}/>;

  return <svg viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <radialGradient id="beamGradient" cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={dotColor} />
        <stop offset="40%" stopColor={dotColor} stopOpacity={0.5} />
        <stop offset="100%" stopColor={dotColor} stopOpacity={0} />
      </radialGradient>
    </defs>
    {beam}
    {dot}
  </svg>;
};

export default LocationMarker;
