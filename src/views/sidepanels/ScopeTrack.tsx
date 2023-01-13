import React, {FC, useState} from 'react';
import {ScopeTrack, UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import TrackPanel from '../../components/scope/TrackPanel';
import useRecordingTrack from '../../hooks/useRecordingTrack';

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

  const recordingTrack = useRecordingTrack();

  const selectedScope = scopeStore.retrieve(scopeId);
  const [selectedTrack, setSelectedTrack] = useState(trackStore.retrieve(trackId));
  const numPoints = pointStore.list().length;
  const numTracks = trackStore.list().length;

  const trackChange = (newTrack: ScopeTrack) => {
    if (trackStore.retrieve(newTrack.id)) {
      trackStore.update(newTrack);
      setSelectedTrack(newTrack);
    }
  };

  const recordTrack = () => {
    recordingTrack.start({
      onStop: (coordinates) => {
        selectedTrack && trackChange({
          ...selectedTrack,
          geometry: coordinates.length ? {
            type: 'LineString',
            coordinates
          } : null
        });
      }
    });
  };

  const goTo = () => {
    console.log('Unimplemented go to Track'); // TODO
  };

  return selectedScope && selectedTrack ? <TrackPanel
    isAccessibleSize={false}
    scope={selectedScope}
    initialTrack={selectedTrack}
    numPoints={numPoints}
    numTracks={numTracks}
    onRecordStart={recordTrack}
    onBackButtonClick={onClose}
    onTrackChange={trackChange}
    onGoTo={goTo}
  /> : <div>Error: the selected track does not exist</div>;
};

export default ScopeTrack;
