import React, {FC} from 'react';
import {ScopeTrack, UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import TrackPanel from '../../components/scope/TrackPanel';

export interface ScopeTrackProps {
  scopeId: UUID,
  trackId: UUID,
  onClose: () => void
}

const ScopeTrack: FC<ScopeTrackProps> = ({
  scopeId, 
  trackId, 
  onClose
}) => {
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedTrack = trackStore.retrieve(trackId);
  const numPoints = pointStore.list().length;
  const numTracks = trackStore.list().length;

  const trackChange = (newTrack: ScopeTrack) => {
    const existing = trackStore.retrieve(newTrack.id);
    existing && trackStore.update(newTrack);
  };
  
  const goTo = () => {
    console.log('Unimplemented go to Track'); // TODO
  };

  const startRecording = () => {
    console.log('Unimplemented Start Recording'); // TODO
  };

  return selectedScope && selectedTrack ? <TrackPanel
    isAccessibleSize={false}
    scope={selectedScope}
    initialTrack={selectedTrack}
    numPoints={numPoints}
    numTracks={numTracks}
    onBackButtonClick={onClose}

    onTrackChange={trackChange}
    onGoTo={goTo}

    onRecordStart={startRecording}
  /> : <div>Error: the selected track does not exist</div>;
};

export default ScopeTrack;
