import React, {FC, useCallback, useEffect, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopeTracks, useScopePoints, useScopes} from '../../hooks/useStoredCollections';
import FeaturesPanel from '../../components/scope/FeaturesPanel';
import ScopePoint from './ScopePoint';
import ScopeTrack from './ScopeTrack';
import useEditingPosition from '../../hooks/singleton/useEditingPosition';
import useShare from '../../hooks/useShare';
import HandleExport from '../../components/scope/export/HandleExport';
import usePointNavigation from '../../hooks/singleton/usePointNavigation';
import useTrackNavigation from '../../hooks/singleton/useTrackNavigation';
import useScopeFeaturesPanelTab from '../../hooks/persistedStates/useScopeFeaturesPanelTab';
import useViewport from '../../hooks/singleton/useViewport';
import {MAP_PROPS} from '../../config';

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
  const {viewport, setViewport} = useViewport();
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

  const unselectPoint = useCallback(() => onPointSelected(), [onPointSelected]);
  const unselectTrack = useCallback(() => onTrackSelected(), [onTrackSelected]);

  const [acceptPoint, setAcceptPoint] = useState(false);

  useEffect(() => {
    if (acceptPoint) {
      const newPosition = [viewport.longitude, viewport.latitude];
      const id = uuid();
      pointStore.create({
        type: 'Feature',
        id: id,
        geometry: {
          type: 'Point',
          coordinates: newPosition
        },
        properties: {
          name: `${t('point')} ${(pointStore.list()?.length ?? 0) + 1}`,
          timestamp: Date.now(),
          description: '',
          images: [],
          isVisible: true
        }
      });
      onPointSelected(id);
      setAcceptPoint(false);
    }
  }, [acceptPoint]);

  const pointAdd = useCallback(() => {
    setViewport({zoom: MAP_PROPS.maxZoom});
    editingPosition.start({
      onAccept: () => setAcceptPoint(true)
    });
  }, [setViewport, editingPosition.start]);

  const pointColorChange = useCallback((pointId: UUID, newColor: HEXColor) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  }, [pointStore, pointStore]);

  const pointRename = useCallback((pointId: UUID, newName: string) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  }, [pointStore]);

  const pointToggleVisibility = useCallback((pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  }, [pointStore]);

  const pointDelete = useCallback((pointId: UUID) => {
    const existing = pointStore.retrieve(pointId);
    existing && pointStore.delete(pointId);
  }, [pointStore]);

  const pointGoTo = useCallback((pointId: UUID) => {
    pointNavigation.start(scopeId, pointId);
  }, [pointNavigation.start, scopeId]);

  const pointExport = useCallback((pointId: UUID) => {
    const point = pointStore.retrieve(pointId);
    if (point) {
      sharePoint(point);
    }
  }, [pointStore, sharePoint]);

  const trackAdd = useCallback(() => {
    trackStore.create({
      type: 'Feature',
      id: uuid(),
      geometry: null,
      properties: {
        name: `${t('track')} ${(trackStore.list()?.length ?? 0) + 1}`,
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      }
    });
  }, [trackStore, t]);

  const trackColorChange = useCallback((trackId: UUID, newColor: HEXColor) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        color: newColor
      }
    });
  }, [trackStore]);

  const trackRename = useCallback((trackId: UUID, newName: string) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        name: newName
      }
    });
  }, [trackStore]);

  const trackToggleVisibility = useCallback((trackId: UUID) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.update({
      ...existing,
      properties: {
        ...existing.properties,
        isVisible: !existing.properties.isVisible
      }
    });
  }, [trackStore]);

  const trackDelete = useCallback((trackId: UUID) => {
    const existing = trackStore.retrieve(trackId);
    existing && trackStore.delete(trackId);
  }, [trackStore]);

  const trackGoTo = useCallback((trackId: UUID) => {
    trackNavigation.start(scopeId, trackId);
  }, [trackNavigation.start, scopeId]);

  const trackExport = useCallback((trackId: UUID) => {
    setSharingTrackId(trackId);
  }, []);

  const closeHandleExport = useCallback(() => {
    setSharingTrackId(undefined);
  }, []);

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
      scopePoints={pointStore?.list() ?? []}
      scopeTracks={trackStore?.list() ?? []}
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
