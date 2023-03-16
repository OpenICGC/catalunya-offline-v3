import React, {FC} from 'react';
import {ScopeTrack, UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import TrackPanel from '../../components/scope/TrackPanel';
import useRecordingTrack from '../../hooks/useRecordingTrack';
import useTrackNavigation from '../../hooks/useTrackNavigation';

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
  const trackNavigation = useTrackNavigation();

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

  const goTo = (trackId: UUID) => {
    trackNavigation.start(scopeId, trackId);
  };

  return selectedScope && selectedTrack ? <TrackPanel
    scope={selectedScope}
    initialTrack={selectedTrack}
    numPoints={numPoints}
    numTracks={numTracks}
    onRecordStart={recordTrack}
    onBackButtonClick={onClose}
    onTrackChange={trackChange}
    onGoTo={goTo}
  /> : null;
};

export default ScopeTrack;
