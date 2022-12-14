import React, {FC, useMemo} from 'react';

//MUI
import Typography from '@mui/material/Typography';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import turfDistance from '@turf/distance';
import turfNearestPointOnLine from '@turf/nearest-point-on-line';

//UTILS
import {HEXColor, ScopePath} from '../../types/commonTypes';
import {USER_COLOR} from '../../config';
import {useTranslation} from 'react-i18next';

export interface TrackProfileProps {
    track: ScopePath,
    color: HEXColor,
    currentPosition?: GeoJSON.Position
    onOffTrackDistance: (distance: number) => void
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
  onOffTrackDistance
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
  
  const vegaPositionProperties = useMemo(() => {
    if(track.geometry && currentPosition){
      return turfNearestPointOnLine(track.geometry, currentPosition, {units: 'meters'}).properties;
    } else return [];
  }, [currentPosition]);
  const vegaPositionIndex = vegaPositionProperties.index;

  const vegaPosition = vegaPositionIndex && vegaPositionIndex >= 0 && vegaTrack[vegaPositionIndex];

  const travelled = vegaTrack.slice(0, vegaPositionIndex && vegaPositionIndex+1);
  
  const offTrackDistance = vegaPositionProperties && vegaPositionProperties.dist;
  console.error('offTrackDistance', `${offTrackDistance?.toFixed(2)}m`);
  
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
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: false,
              format: '.2f'
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
              ticks: false
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
              format: '.2f'
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