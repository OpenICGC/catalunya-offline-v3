import React, {FC, useCallback} from 'react';
import {ScopeTrack, UUID} from '../../types/commonTypes';

import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/usePersistedCollections';
import TrackPanel from '../../components/scope/TrackPanel';
import useRecordingTrack from '../../hooks/singleton/useRecordingTrack';
import useTrackNavigation from '../../hooks/singleton/useTrackNavigation';
import useIsActive from '../../hooks/singleton/useIsActive';

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
  const isActive = useIsActive();
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);

  const trackNavigation = useTrackNavigation();
  const recordingTrack = useRecordingTrack();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedTrack = trackStore.retrieve(trackId);
  const numPoints = pointStore.list()?.length ?? 0;
  const numTracks = trackStore.list()?.length ?? 0;

  const handleTrackChange = useCallback((track: ScopeTrack) => {
    trackStore.update(track);
  }, [trackStore]);

  const recordTrack = useCallback(() => {
    recordingTrack.start(scopeId, trackId);
  }, [recordingTrack.start, scopeId, trackId]);

  const goTo = useCallback((trackId: UUID) => {
    trackNavigation.start(scopeId, trackId);
  }, [trackNavigation.start, scopeId]);

  return selectedScope && selectedTrack ? <TrackPanel
    isActive={isActive}
    scope={selectedScope}
    track={selectedTrack}
    numPoints={numPoints}
    numTracks={numTracks}
    onRecordStart={recordTrack}
    onBackButtonClick={onClose}
    onTrackChange={handleTrackChange}
    onGoTo={goTo}
  /> : null;
};

export default ScopeTrack;
