import React, {FC} from 'react';
import {ScopeTrack, UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import TrackPanel from '../../components/scope/TrackPanel';
import useRecordingTrack from '../../hooks/useRecordingTrack';

export interface ScopeTrackProps {
  scopeId: UUID,
  trackId: UUID,
  onClose: () => void,
  onSidePanelVisibility: () => void,
}

const ScopeTrack: FC<ScopeTrackProps> = ({
  scopeId, 
  trackId, 
  onClose,
  onSidePanelVisibility
}) => {
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const recordingTrack = useRecordingTrack();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedTrack = trackStore.retrieve(trackId);
  const numPoints = pointStore.list().length;
  const numTracks = trackStore.list().length;

  const trackChange = (newTrack: ScopeTrack) => {
    if (trackStore.retrieve(newTrack.id)) {
      trackStore.update(newTrack);
    }
  };

  const handleRecordTrack = () => {
    onSidePanelVisibility();
    recordTrack();
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
    onRecordStart={handleRecordTrack}
    onBackButtonClick={onClose}
    onTrackChange={trackChange}
    onGoTo={goTo}
  /> : null;
};

export default ScopeTrack;
