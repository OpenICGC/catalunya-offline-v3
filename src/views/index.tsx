import React, {FC, useEffect, useState} from 'react';

import Layout from '../components/Layout';
import Map from './Map';

import {Manager, UUID} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import ScopeMain from './sidepanels/ScopeMain';
import Stack from '@mui/material/Stack';
import useMapStyle from '../hooks/useMapStyle';
import useEditingPosition from '../hooks/useEditingPosition';
import useRecordingTrack from '../hooks/useRecordingTrack';
import usePointNavigation from '../hooks/usePointNavigation';
import useTrackNavigation from '../hooks/useTrackNavigation';
import useSelectedScopeId from '../hooks/appState/useSelectedScopeId';
import useSelectedPointId from '../hooks/appState/useSelectedPointId';
import useSelectedTrackId from '../hooks/appState/useSelectedTrackId';
import useVisibleLayers from '../hooks/appState/useVisibleLayers';

const stackSx = {
  height: '100%',
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Index: FC = () => {
  const [isSidePanelOpen, setSidePanelOpen] = useState(false);

  const {baseMapId, mapStyle, setBaseMapId, StyleOfflineDownloaderComponent} = useMapStyle();
  const [manager, setManager] = useState<Manager>(undefined);
  const [scope, setScope] = useSelectedScopeId();
  const [point, setPoint] = useSelectedPointId();
  const [track, setTrack] = useSelectedTrackId();

  const [visibleLayers, setVisibleLayers] = useVisibleLayers();

  const toggleLayerVisibility = (layerId: number) => {
    if(visibleLayers.includes(layerId)) {
      setVisibleLayers(visibleLayers.filter(layer => layer !== layerId));
    } else {
      setVisibleLayers([...visibleLayers, layerId].sort());
    }
  };

  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const pointNavigatingTo = usePointNavigation().target;
  const trackNavigatingTo = useTrackNavigation().target;

  const toggleSidePanel = () => setSidePanelOpen(!isSidePanelOpen);

  const handleManagerChanged = (manager: Manager) => {
    setManager(manager);
    setSidePanelOpen(true);
  };

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

  const handleSelectPoint = (pointId: UUID) => {
    setTrack(undefined);
    setPoint(pointId);
    handleManagerChanged('SCOPES');
  };

  const handleSelectTrack = (trackId: UUID) => {
    setPoint(undefined);
    setTrack(trackId);
    handleManagerChanged('SCOPES');
  };

  const sidePanelContent = manager
    ? <Stack sx={stackSx}>
      {manager === 'LAYERS' && <Layers
        visibleLayers={visibleLayers}
        toggleLayerVisibility={toggleLayerVisibility}
      />}
      {manager === 'BASEMAPS' && <BaseMaps
        baseMapId={baseMapId}
        onMapStyleChanged={setBaseMapId}
        onMapStyleDeleted={() => console.log('Unimplemented')}//TODO
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
    mapStyle={mapStyle}
    onManagerChanged={handleManagerChanged}
    selectedScopeId={scope}
    onScopeSelected={setScope}
    selectedPointId={point}
    onPointSelected={handleSelectPoint}
    selectedTrackId={track}
    onTrackSelected={handleSelectTrack}
    visibleLayers={visibleLayers}
  />;

  return <>
    {StyleOfflineDownloaderComponent}
    <Layout
      sidePanelContent={sidePanelContent}
      mainContent={mainContent}
      isSidePanelOpen={isSidePanelOpen}
      onToggleSidePanel={toggleSidePanel}
    />
  </>;
};

export default Index;
