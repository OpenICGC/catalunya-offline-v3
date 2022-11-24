import React, {FC, useEffect, useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {INITIAL_MAPSTYLE_URL, SM_BREAKPOINT} from '../../config';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Manager} from '../../types/commonTypes';

const Index: FC = () => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setSidePanelOpen] = useState(widescreen);

  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);
  const [manager, setManager] = useState<Manager | undefined>(widescreen ? 'BASEMAPS' : undefined);

  console.log('manager', manager);
  console.log('isSidePanelOpen', isSidePanelOpen);

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

  const mainContent = <MainContent
    mapStyle={mapStyle}
    manager={manager}
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
