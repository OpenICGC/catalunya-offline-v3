import React, {FC, useCallback, useEffect, useState} from 'react';

import Layout from '../components/Layout';
import Map from './Map';

import {Manager, UUID} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import ScopeMain from './sidepanels/ScopeMain';
import Stack from '@mui/material/Stack';
import useEditingPosition from '../hooks/useEditingPosition';
import useRecordingTrack from '../hooks/useRecordingTrack';
import usePointNavigation from '../hooks/usePointNavigation';
import useTrackNavigation from '../hooks/useTrackNavigation';
import {IS_WEB} from '../config';
import useSelectedScopeId from '../hooks/appState/useSelectedScopeId';
import useSelectedPointId from '../hooks/appState/useSelectedPointId';
import useSelectedTrackId from '../hooks/appState/useSelectedTrackId';
import useVisibleLayers from '../hooks/appState/useVisibleLayers';
import useDownloadStatus from '../hooks/useDownloadStatus';
import DownloadRequest from '../components/notifications/DownloadRequest';
import NewDownloadManager from '../components/downloads/NewDownloadsManager';
import useBasemapId from '../hooks/appState/useBasemapId';

const stackSx = {
  height: '100%',
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Index: FC = () => {
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
  }, [visibleLayers]);

  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
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
    isEditingPosition && setSidePanelOpen(false); // Closes panel when editing starts
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

  const handleSelectPoint =  useCallback((pointId: UUID) => {
    setTrack(undefined);
    setPoint(pointId);
    handleManagerChanged('SCOPES');
  }, []);

  const handleSelectTrack =  useCallback((trackId: UUID) => {
    setPoint(undefined);
    setTrack(trackId);
    handleManagerChanged('SCOPES');
  }, []);

  const sidePanelContent = manager
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
  ;

  const mainContent = <Map
    baseMapId={baseMapId}
    onManagerChanged={handleManagerChanged}
    selectedScopeId={scope}
    onScopeSelected={setScope}
    selectedPointId={point}
    onPointSelected={handleSelectPoint}
    selectedTrackId={track}
    onTrackSelected={handleSelectTrack}
    visibleLayers={visibleLayers}
  />;

  if (downloadRequested === true && isOfflineReady === false) return <NewDownloadManager onCancelCbChanged={() => setDownloadRequested(false)}/>;

  return <>
    {downloadRequested === undefined && isOfflineReady === false && !IS_WEB && <DownloadRequest
      isOpen={true}
      onClose={() => setDownloadRequested(false)}
      onDownload={() => setDownloadRequested(true)}
      bytes={pendingSize}
    />}
    <Layout
      sidePanelContent={sidePanelContent}
      mainContent={mainContent}
      isSidePanelOpen={isSidePanelOpen}
      onToggleSidePanel={toggleSidePanel}
    />
  </>;
};

export default Index;
