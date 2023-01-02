import React, {FC} from 'react';

import {ScopePoint, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import PointPanel from '../../components/scope/PointPanel';
import GeoJSON from 'geojson';
import {useViewport} from '../../hooks/useViewport';
import {MAP_PROPS} from '../../config';
import {openPhoto, takePhoto} from '../../utils/camera';

export interface ScopePointProps {
  scopeId: UUID,
  pointId: UUID,
  onClose: () => void,
  onPrecisePositionRequested: (request: GeoJSON.Position | boolean) => void
}

const ScopePoint: FC<ScopePointProps> = ({
  scopeId,
  pointId,
  onClose,
  onPrecisePositionRequested
}) => {
  const scopeStore = useScopes();
  const trackStore = useScopeTracks(scopeId);
  const pointStore = useScopePoints(scopeId);
  const [viewport, setViewport] = useViewport();

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
      ...viewport,
      longitude: targetPosition[0],
      latitude: targetPosition[1],
      zoom: MAP_PROPS.maxZoom - 1
    });
  };

  const deleteImage = (imageId: UUID) => {
    console.log('Unimplemented Delete Image', imageId); // TODO
  };

  const downloadImage = (url: string, title: string) => {
    openPhoto(url, title);
  };

  const addPrecisePosition = () => {
    onPrecisePositionRequested(selectedPoint?.geometry.coordinates || true);
  };

  return selectedScope && selectedPoint ? <PointPanel
    scope={selectedScope}
    initialPoint={selectedPoint}
    numPoints={numPoints}
    numTracks={numTracks}
    onBackButtonClick={onClose}

    onPointChange={pointChange}
    onGoTo={goTo}
    onDeleteImage={deleteImage}
    onDownloadImage={downloadImage}
    onAddPrecisePosition={addPrecisePosition}
  /> : <div>Error: the selected point does not exist</div>;
};

export default ScopePoint;
