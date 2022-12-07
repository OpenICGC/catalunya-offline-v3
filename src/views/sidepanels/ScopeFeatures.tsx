import React, {FC} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import FeaturesPanel from '../../components/scope/FeaturesPanel';
import ScopePoint from './ScopePoint';
import ScopeTrack from './ScopeTrack';
import GeoJSON from 'geojson';
import {useViewport} from '../../hooks/useViewport';

type ScopeFeaturesProps = {
  scopeId: UUID,
  onClose: () => void,
  selectedPoint?: UUID,
  onPointSelected: (scopeId?: UUID) => void,
  selectedPath?: UUID,
  onPathSelected: (scopeId?: UUID) => void,
  onPrecisePositionRequested: (request: GeoJSON.Position | boolean) => void
};

const ScopeFeatures: FC<ScopeFeaturesProps> = ({
  scopeId,
  onClose,
  selectedPoint,
  onPointSelected,
  selectedPath,
  onPathSelected,
  onPrecisePositionRequested
}) => {
  const {t} = useTranslation();

  const scopeStore = useScopes();
  const selectedScope = scopeStore.retrieve(scopeId);

  const pointStore = useScopePoints(scopeId);
  const trackStore = useScopeTracks(scopeId);

  const unselectPoint = () => onPointSelected();
  const unselectPath = () => onPathSelected();

  const [viewport, setViewport] = useViewport();

  const pointAdd = () => {
    pointStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: {
        type: 'Point',
        coordinates: [viewport.longitude, viewport.latitude] // TODO Ask for a PrecisePosition before creating point
      },
      properties: {
        name: `${t('point')} ${pointStore.list().length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  };

  const pointColorChange = (pointId: UUID, newColor: HEXColor) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  };

  const pointRename = (pointId: UUID, newName: string) => {
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
    const targetPosition = pointStore.retrieve(pointId)?.geometry.coordinates;
    targetPosition && setViewport({
      ...viewport,
      longitude: targetPosition[0],
      latitude: targetPosition[1]
    });
  };

  const pointExport = (pointId: UUID) => {
    console.log('Unimplemented Export, Point', pointId); // TODO
  };
  
  
  const pathAdd = () => {
    trackStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [1, 1]] // TODO, coordinates are required for new path to be created
      },
      properties: {
        name: `${t('path')} ${trackStore.list().length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  };

  const pathColorChange = (pathId: UUID, newColor: HEXColor) => {
    const existing = trackStore.retrieve(pathId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  };

  const pathRename = (pathId: UUID, newName: string) => {
    const existing = trackStore.retrieve(pathId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  };

  const pathToggleVisibility = (pathId: UUID) => {
    const existing = trackStore.retrieve(pathId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  };

  const pathDelete = (pathId: UUID) => {
    const existing = trackStore.retrieve(pathId);
    existing && trackStore.delete(pathId);
  };

  const pathGoTo = (pathId: UUID) => {
    console.log('Unimplemented Go To, path', pathId); // TODO
  };

  const pathExport = (pathId: UUID) => {
    console.log('Unimplemented Export, path', pathId); // TODO
  };

  if (selectedPath) return <ScopeTrack
    scopeId={scopeId}
    pathId={selectedPath}
    onClose={unselectPath}
  />;

  if (selectedPoint) return <ScopePoint
    scopeId={scopeId}
    pointId={selectedPoint}
    onClose={unselectPoint}
  />;

  if (selectedScope) return <FeaturesPanel
    scope={selectedScope}
    scopePoints={pointStore.list()}
    scopeTracks={trackStore.list()}
    onBackButtonClick={onClose}

    onSelectPoint={onPointSelected}
    onAddPoint={pointAdd}
    onColorChangePoint={pointColorChange}
    onNameChangePoint={pointRename}
    onToggleVisibilityPoint={pointToggleVisibility}
    onDeletePoint={pointDelete}
    onGoToPoint={pointGoTo}
    onExportPoint={pointExport}

    onSelectTrack={selectPath}
    onAddTrack={pathAdd}
    onColorChangeTrack={pathColorChange}
    onNameChangeTrack={pathRename}
    onToggleVisibilityTrack={pathToggleVisibility}
    onDeleteTrack={pathDelete}
    onGoToTrack={pathGoTo}
    onExportTrack={pathExport}
  />;

  return <div>Error: the selected scope does not exist</div>;
};

export default ScopeFeatures;
