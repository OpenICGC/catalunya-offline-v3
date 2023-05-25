import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';

import Layout from '../components/Layout';
import MapView from './MapView';

import {Manager, UUID} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import ScopeMain from './sidepanels/ScopeMain';
import Stack from '@mui/material/Stack';
import useEditingPosition from '../hooks/singleton/useEditingPosition';
import useRecordingTrack from '../hooks/singleton/useRecordingTrack';
import usePointNavigation from '../hooks/singleton/usePointNavigation';
import useTrackNavigation from '../hooks/singleton/useTrackNavigation';
import {IS_WEB} from '../config';
import useSelectedScopeId from '../hooks/persistedStates/useSelectedScopeId';
import useSelectedPointId from '../hooks/persistedStates/useSelectedPointId';
import useSelectedTrackId from '../hooks/persistedStates/useSelectedTrackId';
import useVisibleLayers from '../hooks/persistedStates/useVisibleLayers';
import useDownloadStatus from '../hooks/singleton/useDownloadStatus';
import DownloadRequest from '../components/notifications/DownloadRequest';
import DownloadManager from './DownloadManager';
import useBasemapId from '../hooks/persistedStates/useBasemapId';
import GpsDisabledAlert from '../components/common/GpsDisabledAlert';

const stackSx = {
  height: '100%',
  overflow: 'hidden',
  m: 0,
  p: 0
};

const MainView: FC = () => {
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

  const [baseMapId, setBaseMapId] = useBasemapId();
  const [manager, setManager] = useState<Manager>(undefined);
  const [scope, setScope] = useSelectedScopeId();
  const [point, setPoint] = useSelectedPointId();
  const [track, setTrack] = useSelectedTrackId();

  const [downloadRequested, setDownloadRequested] = useState<boolean>();
  const {isOfflineReady, pendingSize} = useDownloadStatus();

  const [visibleLayers, setVisibleLayers] = useVisibleLayers();

  const toggleLayerVisibility = useCallback((layerId: number) => {
    if(visibleLayers.includes(layerId)) {
      setVisibleLayers(visibleLayers.filter(layer => layer !== layerId));
    } else {
      setVisibleLayers([...visibleLayers, layerId].sort());
    }
  }, [visibleLayers, setVisibleLayers]);

  const isEditingPosition = useEditingPosition().isEditing;
  const isRecordingTrack =  useRecordingTrack().isRecording;
  const pointNavigatingTo = usePointNavigation().target;
  const trackNavigatingTo = useTrackNavigation().target;

  const toggleSidePanel = useCallback(() => setSidePanelOpen(prevValue => !prevValue), []);

  const handleManagerChanged = useCallback((manager: Manager) => {
    setManager(manager);
    setSidePanelOpen(true);
  }, []);

  useEffect(() => {
    setSidePanelOpen(!!manager);
  }, [manager]);

  useEffect(() => {
    setSidePanelOpen(!isEditingPosition); // Closes panel when editing starts, reopens when editing stops
  }, [isEditingPosition]);

  useEffect(() => {
    isRecordingTrack && setSidePanelOpen(false); // Closes panel when recording starts
  }, [isRecordingTrack]);

  useEffect(() => {
    pointNavigatingTo && setSidePanelOpen(false); // Closes panel when point navigation starts
  }, [pointNavigatingTo?.id]);

  useEffect(() => {
    trackNavigatingTo && setSidePanelOpen(false); // Closes panel when track navigation starts
  }, [trackNavigatingTo?.id]);

  const handleSelectPoint = useCallback((pointId: UUID) => {
    setTrack(undefined);
    setPoint(pointId);
    handleManagerChanged('SCOPES');
  }, [setTrack, setPoint]);

  const handleSelectTrack = useCallback((trackId: UUID) => {
    setPoint(undefined);
    setTrack(trackId);
    handleManagerChanged('SCOPES');
  }, [setTrack, setPoint]);

  const sidePanelContent = useMemo(() => manager
    ? <Stack sx={stackSx}>
      {manager === 'LAYERS' && <Layers
        visibleLayers={visibleLayers}
        toggleLayerVisibility={toggleLayerVisibility}
      />}
      {manager === 'BASEMAPS' && <BaseMaps
        baseMapId={baseMapId}
        onMapStyleChanged={setBaseMapId}
        /*onMapStyleDeleted={() => console.log('Unimplemented')}//TODO*/
        /*onMapStyleAdded={() => console.log('Unimplemented')}//TODO*/
      />}
      {manager === 'SCOPES' && <ScopeMain
        selectedScope={scope}
        onScopeSelected={setScope}
        selectedPoint={point}
        onPointSelected={setPoint}
        selectedTrack={track}
        onTrackSelected={setTrack}
      />}
    </Stack>
    : null
  , [manager, visibleLayers, toggleLayerVisibility, baseMapId, setBaseMapId, scope, setScope, point, setPoint, track, setTrack]);

  const mainContent = useMemo(() => <MapView
    baseMapId={baseMapId}
    onManagerChanged={handleManagerChanged}
    selectedScopeId={scope}
    onScopeSelected={setScope}
    selectedPointId={point}
    onPointSelected={handleSelectPoint}
    selectedTrackId={track}
    onTrackSelected={handleSelectTrack}
    visibleLayers={visibleLayers}
  />, [baseMapId, handleManagerChanged, scope, setScope, point, handleSelectPoint, track, handleSelectTrack, visibleLayers]);

  return <>
    {downloadRequested === true && isOfflineReady === false &&
      <DownloadManager onCancelCbChanged={() => setDownloadRequested(false)}/>
    }
    {downloadRequested === undefined && isOfflineReady === false && !IS_WEB && <DownloadRequest
      isOpen={true}
      onClose={() => setDownloadRequested(false)}
      onDownload={() => setDownloadRequested(true)}
      bytes={pendingSize}
    />}
    <GpsDisabledAlert/>
    <Layout
      sidePanelContent={sidePanelContent}
      mainContent={mainContent}
      isSidePanelOpen={isSidePanelOpen}
      onToggleSidePanel={toggleSidePanel}
    />
  </>;
};

export default MainView;
