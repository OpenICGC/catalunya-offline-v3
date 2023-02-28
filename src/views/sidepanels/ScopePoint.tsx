import React, {FC} from 'react';

import {ScopePoint, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import PointPanel from '../../components/scope/PointPanel';
import usePointNavigation from '../../hooks/usePointNavigation';

export interface ScopePointProps {
  scopeId: UUID,
  pointId: UUID,
  onClose: () => void
}

const ScopePoint: FC<ScopePointProps> = ({
  scopeId,
  pointId,
  onClose
}) => {
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);
  const pointNavigation = usePointNavigation();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedPoint = pointStore.retrieve(pointId);
  const numPoints = pointStore.list().length;
  const numTracks = trackStore.list().length;

  const pointChange = (newPoint: ScopePoint) => {
    const existing = pointStore.retrieve(newPoint.id);
    existing && pointStore.update(newPoint);
  };

  const goTo = (pointId: UUID) => {
    pointNavigation.start(scopeId, pointId);
  };

  return selectedScope && selectedPoint ? <PointPanel
    scope={selectedScope}
    initialPoint={selectedPoint}
    numPoints={numPoints}
    numTracks={numTracks}
    onBackButtonClick={onClose}
    onPointChange={pointChange}
    onGoTo={goTo}
  /> : null;
};

export default ScopePoint;
