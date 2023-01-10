import React, {FC} from 'react';

import {ScopePoint, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import PointPanel from '../../components/scope/PointPanel';
import {useViewport} from '../../hooks/useViewport';
import {MAP_PROPS} from '../../config';
import useEditingPosition from '../../hooks/useEditingPosition';

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
  const {setViewport} = useViewport();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedPoint = pointStore.retrieve(pointId);
  const numPoints = pointStore.list.length;
  const numTracks = trackStore.list.length;

  const pointChange = (newPoint: ScopePoint) => {
    const existing = pointStore.retrieve(newPoint.id);
    existing && pointStore.update(newPoint);
  };

  const goTo = (pointId: UUID) => {
    const targetPosition = pointStore.retrieve(pointId)?.geometry.coordinates;
    targetPosition && setViewport({
      longitude: targetPosition[0],
      latitude: targetPosition[1],
      zoom: MAP_PROPS.maxZoom - 1
    });
  };

  return selectedScope && selectedPoint ? <PointPanel
    scope={selectedScope}
    initialPoint={selectedPoint}
    numPoints={numPoints}
    numTracks={numTracks}
    onBackButtonClick={onClose}
    onPointChange={pointChange}
    onGoTo={goTo}
  /> : <div>Error: the selected point does not exist</div>;
};

export default ScopePoint;
