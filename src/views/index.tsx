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

import { FilePicker } from '@capawesome/capacitor-file-picker';

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
  const [scope, setScope] = useState<UUID>();
  const [point, setPoint] = useState<UUID>();
  const [track, setTrack] = useState<UUID>();

  const isEditingPosition = !!useEditingPosition().position;
  const isRecordingTrack = useRecordingTrack().isRecording;
  const pointNavigatingTo = usePointNavigation().target;
  
  useEffect(() => {
    const pickFiles = async () => {
      const result = await FilePicker.pickFiles({
        types: [
          'application/vnd.geo+json',
          'application/geo+json',
          'application/vnd.google-earth.kml+xml',
          'vnd.gpxsee.map+xml',
          'application/gpx+xml',
          'application/octet-stream'
        ],
        multiple: false,
        readData: true
      });

      console.log('Picked File: ', result);
      if (result.files.length && result.files[0].data) {
        console.log('Readed File: ', window.atob(result.files[0].data));
      }
    };

    pickFiles();
  }, []);

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
    //setManager(undefined);
  };

  useEffect(() => {
    setSidePanelOpen(!!manager);
  }, [manager]);

  useEffect(() => {
    setSidePanelOpen(!isEditingPosition); // Closes panel when editing starts, and opens it when editing stops.
  }, [isEditingPosition]);

  useEffect(() => {
    setSidePanelOpen(!isRecordingTrack); // Closes panel when recording starts, and opens it when recording stops.
  }, [isRecordingTrack]);

  useEffect(() => {
    pointNavigatingTo && setSidePanelOpen(false); // Closes panel when target point changes.
  }, [pointNavigatingTo?.id]);

  const handleShowPointDetails = (pointId: UUID) => {
    setPoint(pointId);
    setSidePanelOpen(true);
  };

  const sidePanelContent = manager
    ? <Stack sx={stackSx}>
      {manager === 'LAYERS' && <Layers
      />}
      {manager === 'BASEMAPS' && <BaseMaps
        isAccessibleSize={false}
        isLeftHanded={false}
        baseMapId={baseMapId}
        onMapStyleChanged={setBaseMapId}
        onMapStyleDeleted={() => console.log('Unimplemented')}//TODO
        onMapStyleAdded={() => console.log('Unimplemented')}//TODO
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
    manager={manager}
    onManagerChanged={setManager}
    selectedScopeId={scope}
    onScopeSelected={setScope}
    selectedPointId={point}
    onPointSelected={setPoint}
    onShowPointDetails={handleShowPointDetails}
    selectedTrackId={track}
    /*onTrackSelected={setTrack}*/
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
