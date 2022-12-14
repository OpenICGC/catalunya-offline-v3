import React, {FC, useMemo} from 'react';

//MUI
import Typography from '@mui/material/Typography';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import turfDistance from '@turf/distance';

//UTILS
import {HEXColor, ScopePath} from '../../types/commonTypes';
import {USER_COLOR} from '../../config';
import {useTranslation} from 'react-i18next';
import {getIndexNearestPointToLine} from '../../utils/getIndexNearestPointToLine';

export interface TrackProfileProps {
    track: ScopePath,
    color: HEXColor,
    currentPosition?: GeoJSON.Position
}

const errorMessageSx = {
  mt: 1,
  mx: 2,
  color: 'error.main',
  display: 'block'
};

const TrackProfile: FC<TrackProfileProps> = ({
  track, 
  color, 
  currentPosition,
}) => {

  const {t} = useTranslation();
    
  //VALIDATORS
  const isLongitudeValid = track.geometry?.coordinates.some(coord => (coord[0] >= -180 && coord[0] <= 180));
  const isLatitudeValid = track.geometry?.coordinates.some(coord => (coord[1] >= -90 && coord[1] <= 90));
  const isHeightValid = track.geometry?.coordinates.some(coord => coord.length >= 3);
  const isTrackValid = track.geometry && isHeightValid && isLongitudeValid && isLatitudeValid;

  const vegaTrack = useMemo(() => {
    const coords = track.geometry?.coordinates;
    let cumulativeLength = 0;
    if (coords && coords.length) {
      return coords.map((c, i) => {
        if (i > 0) {
          cumulativeLength += turfDistance(coords[i - 1], coords[i], {units: 'kilometers'});
        }
        return {
          length: cumulativeLength,
          height: coords[i][2] || 0
        };
      });
    } else return [];
  }, [track]);
  
  const vegaPositionIndex = useMemo(() => {
    if(track.geometry && currentPosition){
      return getIndexNearestPointToLine(track, currentPosition);
    } else return undefined;
  }, [currentPosition]);
  
  const vegaPosition = vegaPositionIndex && vegaPositionIndex >= 0 && vegaTrack[vegaPositionIndex];
  const travelled = vegaTrack.slice(0, vegaPositionIndex && vegaPositionIndex+1);
  
  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 100,
    layer: vegaPosition ? [
      {
        mark: 'line',
        data: { values: vegaTrack},
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
              title: null,
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: true,
              tickSize: 2,
              tickWidth: 2,
              tickCount: 5,
              labelExpr: 'datum.label+\' km\''
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
              ticks: true,
              tickSize: 2,
              tickWidth: 2,
              tickCount: 5,
              labelExpr: 'datum.label+\' m\''
            }
          }
        }
      },
      {
        mark: {
          type: 'point',
          shape: 'circle',
          size: 75,
          filled: true,
          opacity: 1
        },
        data: { values: vegaPosition },
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
            }
          }
        }
      }    
    ] : [
      {
        mark: 'line',
        data: { values: vegaTrack},
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
              ticks: true,
              tickSize: 2,
              tickWidth: 2,
              tickCount: 5,
              labelExpr: 'datum.label+\' m\''
            }
          }
        }
      }],
    config: {
      view: {
        stroke: null
      }
    }
  };

  return isTrackValid ? <VegaLite spec={spec} actions={false}/>
    : <Typography variant='caption' sx={errorMessageSx}>{t('trackAlert.noTrack')}</Typography>;
};

export default TrackProfile;