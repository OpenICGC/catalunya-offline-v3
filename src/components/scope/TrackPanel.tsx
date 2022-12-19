import React, {FC} from 'react';
import {Scope, ScopeTrack} from '../../types/commonTypes';
import Header from './Header';

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
      name={scope.name}
      color={scope.color}
      numPoints={numPoints}
      numTracks={numTracks}
      onBackButtonClick={onBackButtonClick}
    />
    <p>TrackPanel - TODO</p>
    <pre>{JSON.stringify(initialTrack, null, 2)}</pre>
  </>;
};

export default TrackPanel;
