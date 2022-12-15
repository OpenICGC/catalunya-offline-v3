import React, {FC} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import {HEXColor} from '../../types/commonTypes';

export interface GeometryThumbnailProps {
  size?: number,
  color?: HEXColor,
  geometry: GeoJSON.Geometry
}

const GeometryThumbnail: FC<GeometryThumbnailProps> = ({
  size = 64,
  color = '#2f2f2f',
  geometry
}) => {

  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: size,
    height: size,
    layer: [
      {
        mark: {
          type: 'geoshape',
          filled: false,
          color: color,
          strokeWidth: 1
        },
        data: {
          values: [
            {
              type: 'Feature',
              properties: {},
              geometry: geometry
            }
          ],
          format: {
            type: 'json'
          }
        },
        projection: {
          type: 'mercator'
        }
      }
    ],
    config: {
      background: 'transparent'
    }
  };
  return <VegaLite spec={spec} actions={false}/>;
};

export default GeometryThumbnail;
