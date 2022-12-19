import React, {FC, useMemo} from 'react';

//MUI
import Typography from '@mui/material/Typography';

import {VegaLite} from 'react-vega';
import {TopLevelSpec} from 'vega-lite';
import turfDistance from '@turf/distance';

//UTILS
import {HEXColor, ScopeTrack} from '../../types/commonTypes';
import {GPS_POSITION_COLOR} from '../../config';
import {useTranslation} from 'react-i18next';

export interface TrackProfileProps {
    track: ScopeTrack,
    color: HEXColor,
    currentPositionIndex?: number
}
        
export type vegaTrackType = Array<{
    length: number,
    height: number
}>

const errorMessageSx = {
  mt: 1,
  mx: 2,
  color: 'error.main',
  display: 'block'
};

const TrackProfile: FC<TrackProfileProps> = ({
  track, 
  color, 
  currentPositionIndex,
}) => {

  const {t} = useTranslation();
    
  //VALIDATORS
  const isLongitudeValid = track.geometry?.coordinates.some(coord => (coord[0] >= -180 && coord[0] <= 180));
  const isLatitudeValid = track.geometry?.coordinates.some(coord => (coord[1] >= -90 && coord[1] <= 90));
  const isHeightValid = track.geometry?.coordinates.some(coord => coord.length >= 3);
  const isTrackValid = track.geometry && isHeightValid && isLongitudeValid && isLatitudeValid;

  const isNavigateMode: boolean = track.geometry ?
    (currentPositionIndex !== undefined && currentPositionIndex >= 0 && currentPositionIndex < track.geometry.coordinates.length)
    : false;

  const vegaTrack: vegaTrackType = useMemo(() => {
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

  const arrayHeightsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.height);
  const minHeight: number = Math.min(...arrayHeightsTrack);
  const maxHeight: number = Math.max(...arrayHeightsTrack);

  const arrayLengthsTrack: Array<number> = vegaTrack && vegaTrack.map(coord => coord.length);
  const maxLength: number = Math.max(...arrayLengthsTrack);

  const travelled: vegaTrackType = isNavigateMode && currentPositionIndex !== undefined ? vegaTrack.slice(0, currentPositionIndex + 1) : [];
  
  const spec: TopLevelSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    width: 500,
    height: 100,
    layer: isNavigateMode ? [
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
          opacity: 1
        },
        data: { values: currentPositionIndex? vegaTrack[currentPositionIndex] : [] },
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
            scale: { domain: [0, maxLength] },
            axis: {
              labels: false,
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