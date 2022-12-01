import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopePaths, useScopePoints, useScopes} from '../../hooks/usePersitedCollection';
import FeaturesPanel from '../../components/scope/FeaturesPanel';

type ScopeFeaturesProps = {
  scopeId: UUID,
  onClose: () => void
};

const ScopeFeatures: FC<ScopeFeaturesProps> = ({scopeId, onClose}) => {
  const {t} = useTranslation();

  const scopeStore = useScopes();
  const selectedScope = scopeStore.retrieve(scopeId);

  const pointStore = useScopePoints(scopeId);
  const pathStore = useScopePaths(scopeId);

  const [selectedPoint, selectPoint] = useState<UUID>();
  const unselectPoint = () => selectPoint(undefined);

  const [selectedPath, selectPath] = useState<UUID>();
  const unselectPath = () => selectPath(undefined);

  const pointAdd = () => {
    pointStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: {
        type: 'Point',
        coordinates: [0, 0] // TODO, coordinates are required for new point to be created
      },
      properties: {
        name: `${t('point')} ${pointStore.list.length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  };

  const pointColorChange = (newColor: HEXColor, pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  };

  const pointRename = (newName: string, pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  };

  const pointToggleVisibility = (pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  };

  const pointDelete = (pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.delete(pointId);
  };

  const pointGoTo = (pointId: UUID) => {
    console.log('Unimplemented Go To, Point', pointId); // TODO
  };

  const pointExport = (pointId: UUID) => {
    console.log('Unimplemented Export, Point', pointId); // TODO
  };
  
  
  const pathAdd = () => {
    pathStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [1, 1]] // TODO, coordinates are required for new path to be created
      },
      properties: {
        name: `${t('path')} ${pathStore.list.length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  };

  const pathColorChange = (newColor: HEXColor, pathId: UUID) => {
    const existing = pathStore.retrieve(pathId);
    existing && pathStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  };

  const pathRename = (newName: string, pathId: UUID) => {
    const existing = pathStore.retrieve(pathId);
    existing && pathStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  };

  const pathToggleVisibility = (pathId: UUID) => {
    const existing = pathStore.retrieve(pathId);
    existing && pathStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  };

  const pathDelete = (pathId: UUID) => {
    const existing = pathStore.retrieve(pathId);
    existing && pathStore.delete(pathId);
  };

  const pathGoTo = (pathId: UUID) => {
    console.log('Unimplemented Go To, path', pathId); // TODO
  };

  const pathExport = (pathId: UUID) => {
    console.log('Unimplemented Export, path', pathId); // TODO
  };

  return selectedScope ? <FeaturesPanel
    scope={selectedScope}
    scopePoints={pointStore.list}
    scopePaths={pathStore.list}
    onBackButtonClick={onClose}

    onSelectPoint={selectPoint}
    onAddPoint={pointAdd}
    onColorChangePoint={pointColorChange}
    onNameChangePoint={pointRename}
    onToggleVisibilityPoint={pointToggleVisibility}
    onDeletePoint={pointDelete}
    onGoToPoint={pointGoTo}
    onExportPoint={pointExport}

    onSelectPath={selectPath}
    onAddPath={pathAdd}
    onColorChangePath={pathColorChange}
    onNameChangePath={pathRename}
    onToggleVisibilityPath={pathToggleVisibility}
    onDeletePath={pathDelete}
    onGoToPath={pathGoTo}
    onExportPath={pathExport}


  /> : <div>Error: the selected scope does not exist</div>;
};

export default ScopeFeatures;
