import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import FeaturesPanel from '../../components/scope/FeaturesPanel';
import ScopePoint from './ScopePoint';
import ScopeTrack from './ScopeTrack';
import useEditingPosition from '../../hooks/useEditingPosition';
import useShare from '../../hooks/useShare';
import HandleExport from '../../components/scope/export/HandleExport';
import usePointNavigation from '../../hooks/usePointNavigation';
import useTrackNavigation from '../../hooks/useTrackNavigation';
import useScopeFeaturesPanelTab from '../../hooks/appState/useScopeFeaturesPanelTab';

type ScopeFeaturesProps = {
  scopeId: UUID,
  onClose: () => void,
  selectedPoint?: UUID,
  onPointSelected: (scopeId?: UUID) => void,
  selectedTrack?: UUID,
  onTrackSelected: (scopeId?: UUID) => void
};

const ScopeFeatures: FC<ScopeFeaturesProps> = ({
  scopeId,
  onClose,
  selectedPoint,
  onPointSelected,
  selectedTrack,
  onTrackSelected
}) => {
  const {t} = useTranslation();
  const scopeStore = useScopes();
  const pointStore = useScopePoints(scopeId);
  const trackStore = useScopeTracks(scopeId);
  const pointNavigation = usePointNavigation();
  const trackNavigation = useTrackNavigation();
  const {sharePoint}  = useShare();
  const [sharingTrackId, setSharingTrackId] = useState<UUID|undefined>(undefined);

  const [tabValue, setTabValue] = useScopeFeaturesPanelTab();

  const selectedScope = scopeStore.retrieve(scopeId);
  const editingPosition = useEditingPosition();

  const unselectPoint = () => onPointSelected();
  const unselectTrack = () => onTrackSelected();

  const pointAdd = () => {
    editingPosition.start({
      onAccept: (newPosition) => {
        const id = uuid();
        pointStore.create({
          type: 'Feature',
          id: id,
          geometry: {
            type: 'Point',
            coordinates: newPosition
          },
          properties: {
            name: `${t('point')} ${pointStore.list().length + 1}`,
            timestamp: Date.now(),
            description: '',
            images: [],
            isVisible: true
          }
        });
        onPointSelected(id);
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
    pointNavigation.start(scopeId, pointId);
  };

  const pointExport = (pointId: UUID) => {
    const point = pointStore.retrieve(pointId);
    if (point) {
      sharePoint(point);
    }
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
    trackNavigation.start(scopeId, trackId);
  };

  const trackExport = (trackId: UUID) => {
    setSharingTrackId(trackId);
  };

  const closeHandleExport = () => setSharingTrackId(undefined);

  if (selectedTrack) return <ScopeTrack
    scopeId={scopeId}
    trackId={selectedTrack}
    onClose={unselectTrack}
  />;

  if (selectedPoint) return <ScopePoint
    scopeId={scopeId}
    pointId={selectedPoint}
    onClose={unselectPoint}
  />;

  if (selectedScope) return <>
    <FeaturesPanel
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

      tabValue={tabValue}
      setTabValue={setTabValue}
    />
    {
      sharingTrackId &&
      <HandleExport
        scopeId={scopeId}
        trackId={sharingTrackId}
        onSharedStarted={closeHandleExport}
        onSharedCancel={closeHandleExport}
      />
    }
  </>;

  return null;
};

export default ScopeFeatures;
