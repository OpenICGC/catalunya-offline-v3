import React, {FC, useMemo} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import turfDistance from '@turf/distance';

//MUI
import Box from '@mui/material/Box';

//UTILS
import {HEXColor} from '../../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {Position} from 'geojson';
import OutOfTrackButton from '../../buttons/OutOfTrackButton';
import Typography from '@mui/material/Typography';
import useGpsPositionColor from '../../../hooks/settings/useGpsPositionColor';

//STYLES
const profileContainerSx = {
  m: 0, 
  p: 0, 
  position: 'relative'  
};

export interface TrackProfileProps {
    coordinates?: Position[],
    color?: HEXColor,
    currentPositionIndex?: number,
    isOutOfTrack: boolean
}
        
export type vegaTrackType = Array<{
    length: number,
    height: number
}>

const TrackProfile: FC<TrackProfileProps> = ({
  coordinates,
  color = '#2f2f2f',
  currentPositionIndex,
  isOutOfTrack
}) => {

  const {t} = useTranslation();

  const [gpsPositionColor] = useGpsPositionColor();
    
  //VALIDATORS
  const isLongitudeValid = coordinates?.some(coord => (coord[0] >= -180 && coord[0] <= 180));
  const isLatitudeValid = coordinates?.some(coord => (coord[1] >= -90 && coord[1] <= 90));
  const isHeightValid = coordinates?.some(coord => coord.length >= 3) && !coordinates?.every(coord => coord[2] === 0);
  const isTrackValid = coordinates && isHeightValid && isLongitudeValid && isLatitudeValid;
  {
    !isTrackValid && console.warn(t('trackAlert.noTrack'));
  }
  const isNavigateMode: boolean = coordinates ?
    (currentPositionIndex !== undefined && currentPositionIndex >= 0 && currentPositionIndex < coordinates.length)
    : false;
  const vegaTrack: vegaTrackType = useMemo(() => {
    const coords = coordinates;
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
  }, [coordinates]);

  const arrayHeightsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.height);
  const minHeight: number = Math.min(...arrayHeightsTrack);
  const maxHeight: number = Math.max(...arrayHeightsTrack);

  const arrayLengthsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.length);
  const maxLength: number = Math.max(...arrayLengthsTrack);

  const travelled: vegaTrackType = isNavigateMode && currentPositionIndex !== undefined ?
    vegaTrack.slice(0, currentPositionIndex + 1) :
    [];
  
  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 'container',
    height: 100,
    layer: isNavigateMode ? [
      {
        mark: {
          type: 'line',
          opacity: isOutOfTrack? 0.25 : 1
        },
        data: { values: vegaTrack },
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length', 
            type: 'quantitative',
            title: null,
            scale: { domain: [0, maxLength] },
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
            scale: { domain: [minHeight-5, maxHeight+5] },
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
          opacity: isOutOfTrack? 0 : 1
        },
        data: { 
          values: currentPositionIndex !== undefined ? 
            vegaTrack[currentPositionIndex] :
            [] 
        },
        encoding: {
          color: {
            value: gpsPositionColor,
          },
          x: {
            field: 'length',
            type: 'quantitative',
            scale: { domain: [0, maxLength] },
          },
          y: {
            field: 'height',
            type: 'quantitative',
            scale: { domain: [minHeight-5, maxHeight+5] },
          }
        }
      },
      {
        mark: {
          type: 'area',
          opacity: isOutOfTrack? 0 : 0.25
        },
        data: { values: travelled},
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length',
            type: 'quantitative',
            scale: { domain: [0, maxLength] },
          },
          y: {
            field: 'height',
            type: 'quantitative',
            scale: { domain: [minHeight-5, maxHeight+5] },
          }
        }
      }
    ] : [
      {
        mark: 'line',
        data: { values: vegaTrack },
        encoding: {
          color: {
            value: color,
          },
          x: {
            field: 'length',
            type: 'quantitative',
            title: null,
            scale: { domain: [0, maxLength] },
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
            scale: { domain: [minHeight-5, maxHeight+5] },
            axis: {
              labels: true,
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
            scale: { domain: [0, maxLength] },
          },
          y: {
            field: 'height',
            type: 'quantitative',
            scale: { domain: [minHeight-5, maxHeight+5] },
          }
        }
      }   ],
    config: {
      view: {
        stroke: null
      }
    }
  };

  return isTrackValid ? <Box sx={profileContainerSx}>
    <VegaLite spec={spec} actions={false}/>
    {
      isOutOfTrack && <OutOfTrackButton/>
    }
  </Box> : <Typography variant='caption' sx={{color: 'error.main'}}>{t('trackAlert.noTrack')}</Typography>;
};

export default TrackProfile;