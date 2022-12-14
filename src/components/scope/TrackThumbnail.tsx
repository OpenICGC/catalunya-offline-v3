import React, {FC} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';

export interface TrackThumbnailProps {
    track: GeoJSON.Geometry,
}

const TrackThumbnail: FC<TrackThumbnailProps> = ({track}) => {

  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 54,
    height: 54,
    layer: [
      {
        mark: {
          type: 'geoshape',
          filled: false,
          color: '#2f2f2f',
          strokeWidth: 1
        },
        data: {
          values: [
            {
              type: 'Feature',
              properties: {},
              geometry: track,
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
      background: 'transparent',
    }
  };
  return <VegaLite spec={spec} actions={false}/>;
};

export default TrackThumbnail;