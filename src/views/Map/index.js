import React, {useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {INITIAL_MAPSTYLE_URL, SM_BREAKPOINT} from '../../config';
import useMediaQuery from '@mui/material/useMediaQuery';

const Index = () => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(widescreen);
  const toggleSidePanel = () => setSidePanelOpen(!isSidePanelOpen);

  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [manager, setManager] = useState(widescreen && 'BASEMAPS');
  useEffect(() => {
    setSidePanelOpen(widescreen || !!manager);
  }, [manager]);

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    onMapStyleChanged={setMapStyle}
    manager={manager}
  />;

  const mainContent = <MainContent
    mapStyle={mapStyle}
    onManagerChanged={setManager}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
    isSidePanelOpen={isSidePanelOpen}
    onToggleSidePanel={toggleSidePanel}
  />;
};

export default Index;
