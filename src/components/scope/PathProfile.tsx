import React, {FC, useEffect, useMemo} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import {HEXColor, ScopePath} from '../../types/commonTypes';
import {USER_COLOR} from '../../config';
import turfDistance from '@turf/distance';

export interface PathProfileProps {
    path: ScopePath,
    color: HEXColor,
    currentPosition?: GeoJSON.Position //[x, y, z?] => turf => devuelve el punto de la línea y la separación, a ver que z da, si da
}

const PathProfile: FC<PathProfileProps> = ({
  path, 
  color, 
  currentPosition
}) => {

  /*const coords = path.geometry?.coordinates;*/
  /*const vegaData: Array<{ length: number; height: number; }> = [];*/
  const vegaData2 = [
    {length: 0, height: 115},
    {length: 0.08313957091020711, height: 141},
    {length: 9.049044553437191, height: 141},
    {length: 30.414549636343995, height: 140},
    {length: 37.08369443562548, height: 139},
    {length: 41.78730441919822, height: 119},
    {length: 51.562370803444054, height: 38},
    {length: 78.66817229580234, height: 56}
  ];
  let travelled = 0;

  const vegaData = useMemo(() => {
    const coords = path.geometry?.coordinates;
    //comprobar que los array al menos 3 elementos
    //story con coords null o con array vacío
    if (coords && coords.length) {
      return coords.map((c, i) => {
        if (i > 0) {
          travelled += turfDistance(coords[i - 1], coords[i], {units: 'meters'});
        }
        return {
          length: travelled,
          height: coords[i][2] || 0
        };
      });
    } else return [];
  }, [path]);

  console.log('vegaData', vegaData);
  console.log('vegaData2', vegaData2);

  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 100,
    layer: [{
      mark: 'line',
      data: { values: vegaData},
      encoding: {
        color: {
          value: color,
        },
        x: {
          field: 'length',
          type: 'quantitative',
          title: null,
          axis: {
            labels: true,
            domain: true,
            labelPadding: 10,
            labelAngle: 0,
            grid: false,
            ticks: false,
          }
        },
        y: {
          field: 'height',
          type: 'quantitative',
          title: null,
          axis: {
            labelPadding: 10,
            labelAngle: 0,
            domain: true,
            grid: false,
            ticks: false,
          }
        }
      }
    }],
    /*layer: currentPosition ?  [
      {
        mark: 'line',
        data: { values: vegaData},
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length', 
            type: 'quantitative',
            title: null,
            axis: {
              labels: false,
              domain: true,
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: false,
            }
          },
          y: {
            field: 'height', 
            type: 'quantitative',
            title: null,
            axis: {
              labelPadding: 10,
              labelAngle: 0,
              domain: true,
              grid: false,
              ticks: false,
            }
          }
        }
      },
      {
        mark: {
          type: 'point',
          shape: 'circle',
          size: 100,
          filled: true,
          opacity: 1
        },
        data: { values: currentPosition},
        encoding: {
          color: {
            value: USER_COLOR,
          },
          x: {
            field: 'length',
            type: 'quantitative',
          },
          y: {
            field: 'height',
            type: 'quantitative',
          }
        }
      },
      {
        mark: {
          type: 'area',
          opacity: 0.25
        },
        data: { values: travelled},
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length',
            type: 'quantitative',
            title: null,
            axis: {
              labels: false,
              domain: true,
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: false,
            }
          },
          y: {
            field: 'height',
            type: 'quantitative',
            title: null,
            axis: {
              labelPadding: 10,
              labelAngle: 0,
              domain: true,
              grid: false,
              ticks: false,
            }
          }
        }
      },
    ] :  [
      {
        mark: 'line',
        data: { values: vegaData},
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length', 
            type: 'quantitative',
            title: null,
            axis: {
              labels: false,
              domain: true,
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: false,
            }
          },
          y: {
            field: 'height', 
            type: 'quantitative',
            title: null,
            axis: {
              labelPadding: 10,
              labelAngle: 0,
              domain: true,
              grid: false,
              ticks: false,
            }
          }
        }
      }
    ],*/
    config: {
      view: {
        stroke: null
      }
    }
  };

  return <VegaLite spec={spec} actions={false}/>;
};

export default PathProfile;