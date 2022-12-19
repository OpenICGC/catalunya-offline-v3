import React, {FC, useEffect, useState} from 'react';

import Layout from '../components/Layout';
import SidePanelContent from './SidePanelContent';
import Map from './Map';

import {INITIAL_MANAGER, SM_BREAKPOINT} from '../config';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Manager} from '../types/commonTypes';
import useMapStyle from '../hooks/useMapStyle';

const Index: FC = () => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(widescreen);

  const {baseMapId, mapStyle, setBaseMapId, StyleOfflineDownloaderComponent} = useMapStyle();
  const [manager, setManager] = useState<Manager>(widescreen ? INITIAL_MANAGER : undefined);

  const toggleSidePanel = () => {
    setSidePanelOpen(!isSidePanelOpen);
    setManager(undefined);
  };

  useEffect(() => {
    setSidePanelOpen(!!manager);
  }, [manager]);

  const sidePanelContent = manager
    ? <SidePanelContent
      baseMapId={baseMapId}
      onMapStyleChanged={setBaseMapId}
      manager={manager}
    />
    : <></>
  ;

  const mainContent = <Map
    mapStyle={mapStyle}
    manager={manager}
    onManagerChanged={setManager}
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
