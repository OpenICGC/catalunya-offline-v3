import React, {FC, useMemo} from 'react';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import turfDistance from '@turf/distance';

//MUI
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//UTILS
import {HEXColor} from '../../../types/commonTypes';
import {GPS_POSITION_COLOR} from '../../../config';
import {useTranslation} from 'react-i18next';
import GeoJSON from 'geojson';

//STYLES
const alertOutOfTrackSx = {
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  left: '50%',
  top: '50%',
  color: 'error.light', 
  p: 1,
  borderRadius: 2, 
  border: 1, 
  borderColor: 'error.light', 
  bgcolor: 'rgba(255,255,255,0.75)'
};
  
const profileContainerSx = {
  m: 0, 
  p: 0, 
  position: 'relative'  
};

export interface TrackProfileProps {
    geometry: GeoJSON.LineString | null,
    color?: HEXColor,
    currentPositionIndex?: number,
    isOutOfTrack: boolean,
    isReverseDirection?: boolean
}
        
export type vegaTrackType = Array<{
    length: number,
    height: number
}>

const TrackProfile: FC<TrackProfileProps> = ({
  geometry,
  color = '#2f2f2f',
  currentPositionIndex,
  isOutOfTrack,
  isReverseDirection= false
}) => {

  const {t} = useTranslation();
    
  //VALIDATORS
  const isLongitudeValid = geometry?.coordinates.some(coord => (coord[0] >= -180 && coord[0] <= 180));
  const isLatitudeValid = geometry?.coordinates.some(coord => (coord[1] >= -90 && coord[1] <= 90));
  const isHeightValid = geometry?.coordinates.some(coord => coord.length >= 3);
  const isTrackValid = geometry && isHeightValid && isLongitudeValid && isLatitudeValid;
  {
    !isTrackValid && console.warn(t('trackAlert.noTrack'));
  }
  const isNavigateMode: boolean = geometry ?
    (currentPositionIndex !== undefined && currentPositionIndex >= 0 && currentPositionIndex < geometry.coordinates.length)
    : false;
  const vegaTrack: vegaTrackType = useMemo(() => {
    const coords = geometry?.coordinates;
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
  }, [geometry]);

  
  const trackReverse = (track: vegaTrackType) => {
    const allReversed = [...track].reverse();
    return allReversed.reduce((acc: vegaTrackType, item, i, track) => {
      acc.push({
        length: track[0].length-item.length,
        height: item.height
      });
      return acc;
    }, []);
  };

  const arrayHeightsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.height);
  const minHeight: number = Math.min(...arrayHeightsTrack);
  const maxHeight: number = Math.max(...arrayHeightsTrack);

  const arrayLengthsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.length);
  const maxLength: number = Math.max(...arrayLengthsTrack);

  const travelled: vegaTrackType = isNavigateMode && currentPositionIndex !== undefined ?
    isReverseDirection ?
      trackReverse(vegaTrack).slice(0, currentPositionIndex + 1) :
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
        data: { values: isReverseDirection ? trackReverse(vegaTrack) : vegaTrack },
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
            isReverseDirection? 
              trackReverse(vegaTrack)[currentPositionIndex] : 
              vegaTrack[currentPositionIndex] : 
            [] 
        },
        encoding: {
          color: {
            value: GPS_POSITION_COLOR,
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
        data: { values: isReverseDirection ? trackReverse(vegaTrack) : vegaTrack },
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
              labels: false,
              domain: false,
              title: null,
              labelPadding: 10,
              labelAngle: 0,
              grid: false,
              ticks: false,
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
              labels: false,
              labelPadding: 10,
              labelAngle: 0,
              domain: false,
              grid: false,
              ticks: false,
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
      isOutOfTrack && <Typography variant="button" sx={alertOutOfTrackSx}>{t('trackAlert.outOfTrack')}</Typography>
    }
  </Box> :
    null;
};

export default TrackProfile;