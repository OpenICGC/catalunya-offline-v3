import React, {FC, useEffect, useState} from 'react';

import Layout from '../components/Layout';
import Map from './Map';

import {INITIAL_MANAGER, SM_BREAKPOINT} from '../config';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Manager, UUID} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import ScopeMain from './sidepanels/ScopeMain';
import Stack from '@mui/material/Stack';
import GeoJSON from 'geojson';
import {useScopePoints} from '../hooks/useStoredCollections';
import useMapStyle from '../hooks/useMapStyle';

const stackSx = {
  height: '100%',
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Index: FC = () => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(widescreen);

  const {baseMapId, mapStyle, setBaseMapId, StyleOfflineDownloaderComponent} = useMapStyle();
  const [manager, setManager] = useState<Manager>(widescreen ? INITIAL_MANAGER : undefined);
  const [scope, setScope] = useState<UUID>();
  const [point, setPoint] = useState<UUID>();
  const [track, setTrack] = useState<UUID>();
  const pointStore = useScopePoints(scope);

  const acceptPrecisePosition = (position: GeoJSON.Position) => {
    const prevPoint = point && pointStore.retrieve(point);
    if (prevPoint) {
      pointStore.update({
        ...prevPoint,
        geometry: {
          ...prevPoint.geometry,
          coordinates: position
        }
      });
    }
  };

  const cancelPrecisePosition = () => {
    // TODO
  };

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
    setManager(undefined);
  };

  useEffect(() => {
    setSidePanelOpen(!!manager);
  }, [manager]);

  const sidePanelContent = manager
    ? <Stack sx={stackSx}>
      {manager === 'LAYERS' && <Layers
      />}
      {manager === 'BASEMAPS' && <BaseMaps
        baseMapId={baseMapId}
        onMapStyleChanged={setBaseMapId}
      />}
      {manager === 'SCOPES' && <ScopeMain
        selectedScope={scope}
        onScopeSelected={setScope}
        selectedPoint={point}
        onPointSelected={setPoint}
        selectedTrack={track}
        onTrackSelected={setTrack}
        onPrecisePositionRequested={() => undefined}
      />}
    </Stack>
    : <></>
  ;

  const mainContent = <Map
    mapStyle={mapStyle}
    manager={manager}
    onManagerChanged={setManager}
    selectedScope={scope}
    setSelectedPoint={setPoint}
    //precisePositionRequest={precisePositionRequest}
    onPrecisePositionAccepted={acceptPrecisePosition}
    onPrecisePositionCancelled={cancelPrecisePosition}
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
