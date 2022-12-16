import React, {FC} from 'react';
import {UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useLocalStores';
import TrackPanel from '../../components/scope/TrackPanel';

export interface ScopeTrackProps {
  scopeId: UUID,
  pathId: UUID,
  onClose: () => void
}

const ScopeTrack: FC<ScopeTrackProps> = ({scopeId, pathId, onClose}) => {
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId)();
  const pointStore = useScopePoints(scopeId)();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedTrack = trackStore.retrieve(pathId);
  const numPoints = pointStore.list.length;
  const numTracks = trackStore.list.length;

  return selectedScope && selectedTrack ? <TrackPanel
    scope={selectedScope}
    initialTrack={selectedTrack}
    numPoints={numPoints}
    numTracks={numTracks}
    onBackButtonClick={onClose}
  /> : <div>Error: the selected path does not exist</div>;
};

export default ScopeTrack;
