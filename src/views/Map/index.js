import React, {useState} from 'react';

import Layout from '../../components/Layout';
import SidePanelContent from './SidePanelContent';
import MainContent from './MainContent';

import {INITIAL_MAPSTYLE_URL} from '../../config';

const Index = () => {
  const [mapStyle, setMapStyle] = useState(INITIAL_MAPSTYLE_URL);

  const sidePanelContent = <SidePanelContent
    mapStyle={mapStyle}
    onMapStyleChanged={setMapStyle}
  />;

  const mainContent = <MainContent
    mapStyle={mapStyle}
  />;

  return <Layout
    sidePanelContent={sidePanelContent}
    mainContent={mainContent}
  />;
};

export default Index;
