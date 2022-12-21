import React, {FC} from 'react';

import Header from '../common/Header';

import ArrowBackIcon from '@mui/icons-material/DoubleArrow';

import FeaturesSummary from './FeaturesSummary';

import {Scope, ScopeTrack} from '../../types/commonTypes';

export type TrackPanelProps = {
  scope: Scope,
  initialTrack: ScopeTrack,
  numPoints: number,
  numTracks: number,
  onBackButtonClick: () => void
};

const TrackPanel: FC<TrackPanelProps> = ({
  scope,
  initialTrack,
  numPoints,
  numTracks,
  onBackButtonClick
}) => {
  return <>
    <Header
      startIcon={<ArrowBackIcon sx={{transform: 'rotate(180deg)'}}/>}
      name={scope.name}
      color={scope.color}
      onStartIconClick={onBackButtonClick}
    >
      <FeaturesSummary numPoints={numPoints} numTracks={numTracks} colorContrastFrom={scope.color}/>
    </Header>
    <p>TrackPanel - TODO</p>
    <pre>{JSON.stringify(initialTrack, null, 2)}</pre>
  </>;
};

export default TrackPanel;
