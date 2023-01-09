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
import {MAP_PROPS} from '../../config';

type ScopeFeaturesProps = {
  scopeId: UUID,
  onClose: () => void,
  selectedPoint?: UUID,
  onPointSelected: (scopeId?: UUID) => void,
  selectedTrack?: UUID,
  onTrackSelected: (scopeId?: UUID) => void,
  onPrecisePositionRequested: (request: GeoJSON.Position | boolean) => void
};

const ScopeFeatures: FC<ScopeFeaturesProps> = ({
  scopeId,
  onClose,
  selectedPoint,
  onPointSelected,
  selectedTrack,
  onTrackSelected,
  onPrecisePositionRequested
}) => {
  const {t} = useTranslation();

  const scopeStore = useScopes();
  const selectedScope = scopeStore.retrieve(scopeId);

  const pointStore = useScopePoints(scopeId);
  const trackStore = useScopeTracks(scopeId);

  const unselectPoint = () => onPointSelected();
  const unselectTrack = () => onTrackSelected();

  const {viewport, setViewport} = useViewport();

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
      longitude: targetPosition[0],
      latitude: targetPosition[1],
      zoom: MAP_PROPS.maxZoom - 1
    });
  };

  const pointExport = (pointId: UUID) => {
    console.log('Unimplemented Export, Point', pointId); // TODO
  };
  
  
  const trackAdd = () => {
    trackStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: null,
      properties: {
        name: `${t('track')} ${trackStore.list().length + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  };

  const trackColorChange = (trackId: UUID, newColor: HEXColor) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  };

  const trackRename = (trackId: UUID, newName: string) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  };

  const trackToggleVisibility = (trackId: UUID) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  };

  const trackDelete = (trackId: UUID) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.delete(trackId);
  };

  const trackGoTo = (trackId: UUID) => {
    console.log('Unimplemented Go To, track', trackId); // TODO
  };

  const trackExport = (trackId: UUID) => {
    console.log('Unimplemented Export, track', trackId); // TODO
  };

  if (selectedTrack) return <ScopeTrack
    scopeId={scopeId}
    trackId={selectedTrack}
    onClose={unselectTrack}
  />;

  if (selectedPoint) return <ScopePoint
    scopeId={scopeId}
    pointId={selectedPoint}
    onClose={unselectPoint}
    onPrecisePositionRequested={onPrecisePositionRequested}
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

    onSelectTrack={onTrackSelected}
    onAddTrack={trackAdd}
    onColorChangeTrack={trackColorChange}
    onNameChangeTrack={trackRename}
    onToggleVisibilityTrack={trackToggleVisibility}
    onDeleteTrack={trackDelete}
    onGoToTrack={trackGoTo}
    onExportTrack={trackExport}
  />;

  return <div>Error: the selected scope does not exist</div>;
};

export default ScopeFeatures;
