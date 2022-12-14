import React, {FC} from 'react';

import {ScopePoint, UUID} from '../../types/commonTypes';
import {useScopePaths, useScopePoints, useScopes} from '../../hooks/useLocalStores';
import PointPanel from '../../components/scope/PointPanel';

export interface ScopePointProps {
  scopeId: UUID,
  pointId: UUID,
  onClose: () => void
}

const ScopePoint: FC<ScopePointProps> = ({scopeId, pointId, onClose}) => {
  const scopeStore = useScopes();
  const pathStore = useScopePaths(scopeId)();
  const pointStore = useScopePoints(scopeId)();

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedPoint = pointStore.retrieve(pointId);
  const numPoints = pointStore.list.length;
  const numPaths = pathStore.list.length;

  const pointChange = (newPoint: ScopePoint) => {
    const existing = pointStore.retrieve(newPoint.id);
    existing && pointStore.update(newPoint);
  };

  const goTo = (pointId: UUID) => {
    console.log('Unimplemented Go To, Point', pointId); // TODO
  };

  const addImage = () => {
    console.log('Unimplemented Add Image'); // TODO
  };

  const deleteImage = (imageId: UUID) => {
    console.log('Unimplemented Delete Image', imageId); // TODO
  };

  const downloadImage = (imageId: UUID, contentType: string) => {
    console.log('Unimplemented Download Image', imageId, contentType); // TODO
  };

  const addPrecisePosition = () => {
    console.log('Unimplemented Add Precise Position'); // TODO
  };

  return selectedScope && selectedPoint ? <PointPanel
    scope={selectedScope}
    initialPoint={selectedPoint}
    numPoints={numPoints}
    numPaths={numPaths}
    onBackButtonClick={onClose}

    onPointChange={pointChange}
    onGoTo={goTo}
    onAddImage={addImage}
    onDeleteImage={deleteImage}
    onDownloadImage={downloadImage}
    onAddPrecisePosition={addPrecisePosition}
  /> : <div>Error: the selected point does not exist</div>;
};

export default ScopePoint;
