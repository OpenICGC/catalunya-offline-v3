import React, {FC, useMemo} from 'react';
import {HEXColor} from '../../types/commonTypes';
import {GPS_POSITION_DEFAULT_COLOR, GPS_POSITION_STALE_COLOR} from '../../config';

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
export const SIZE = 100;
const DOT_RADIUS = 10;
const CENTER = SIZE / 2;
const DEFAULT_HEADING_ACCURACY = 45;

export interface LocationMarkerIconProps {
  color?: HEXColor
  heading?: number,
  headingAccuracy?: number,
  isStale?: boolean
}

const LocationMarkerIcon: FC<LocationMarkerIconProps> = ({
  color = GPS_POSITION_DEFAULT_COLOR,
  heading,
  headingAccuracy= DEFAULT_HEADING_ACCURACY,
  isStale = false
}) => {

  const dotColor: HEXColor = isStale ? GPS_POSITION_STALE_COLOR : color;

  const beam = useMemo(() => {
    if (heading === undefined) {
      return null;
    } else {
      const beamProps = {
        cx: CENTER,
        cy: CENTER,
        radius: CENTER,
        start_angle: heading - headingAccuracy / 2,
        end_angle: heading + headingAccuracy / 2,
        thickness: CENTER - DOT_RADIUS
      };
      return <path d={getArcD(beamProps)} fill="url(#beamGradient)" fillRule="evenodd" />;
    }
  }, [heading, headingAccuracy, isStale]);

  const dot = <circle cx={CENTER} cy={CENTER} r={DOT_RADIUS} stroke='#FFF' strokeWidth="2" style={DOT_STYLE} fill={dotColor}/>;

  return <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
    <defs>
      <radialGradient id="beamGradient" cx={CENTER} cy={CENTER} r={CENTER} gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={dotColor} />
        <stop offset="40%" stopColor={dotColor} stopOpacity={0.5} />
        <stop offset="100%" stopColor={dotColor} stopOpacity={0} />
      </radialGradient>
    </defs>
    {beam}
    {dot}
  </svg>;
};

export default LocationMarkerIcon;
