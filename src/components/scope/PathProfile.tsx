import React, {FC} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import {HEXColor} from '../../types/commonTypes';
import {USER_COLOR} from '../../config';

export interface PathProfileProps {
    path: Array<{ length: number, height: number}>,
    color: HEXColor,
    user?: { length: number, height: number},
}

const PathProfile: FC<PathProfileProps> = ({path, color, user}) => {

  const userIndex = user && path.map(p => p.length).indexOf(user.length);
  const traveled = path.slice(0, userIndex && userIndex+1);
  
  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 100,
    layer: user ?  [
      {
        mark: 'line',
        data: { values: path},
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
        data: { values: user},
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
        data: { values: traveled},
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
        data: { values: path},
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
    ],
    config: {
      view: {
        stroke: null
      }
    }
  };

  return <VegaLite spec={spec} actions={false}/>;
};

export default PathProfile;