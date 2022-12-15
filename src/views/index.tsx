import React, {FC, useEffect, useState} from 'react';

import Layout from '../components/Layout';
import SidePanelContent from './SidePanelContent';
import Map from './Map';

import {INITIAL_MANAGER, INITIAL_MAPSTYLE_URL, SM_BREAKPOINT} from '../config';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Manager} from '../types/commonTypes';
import DownloadsManager from '../components/downloads/DownloadsManager';

const Index: FC = () => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(widescreen);

  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
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
      mapStyle={mapStyle}
      onMapStyleChanged={setMapStyle}
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
    <DownloadsManager manager={manager} />
    <Layout
      sidePanelContent={sidePanelContent}
      mainContent={mainContent}
      isSidePanelOpen={isSidePanelOpen}
      onToggleSidePanel={toggleSidePanel}
    />
  </>;
};

export default Index;
