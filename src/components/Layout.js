import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';

import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';
import MiniSidePanel from '@geomatico/geocomponents/MiniSidePanel';

import {
  DRAWER_WIDTH,
  MINI_SIDE_PANEL_DENSE_WIDTH,
  MINI_SIDE_PANEL_WIDTH,
  MINISIDEPANEL_CONFIG, SM_BREAKPOINT,
} from '../config';

const Main = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'widescreen' && prop !== 'isleftdraweropen'
})(({widescreen, isleftdraweropen}) => ({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 56,
  '@media (min-width: 0px) and (orientation: landscape)': {
    top: 48
  },
  ['@media (min-width: '+ SM_BREAKPOINT +'px)']: {
    top: 64
  },
  bottom: 0,
  right: 0,
  left: widescreen ? (isleftdraweropen && DRAWER_WIDTH) + MINI_SIDE_PANEL_WIDTH : MINI_SIDE_PANEL_DENSE_WIDTH
}));

const Layout = ({mainContent, sidePanelContent, miniSidePanelSelectedActionId}) => {
  const navigate = useNavigate();

  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);

  const handleActionClick = (id) => {
    const config_element = MINISIDEPANEL_CONFIG.find(el => el.id === id);
    if (miniSidePanelSelectedActionId === id && sidePanelContent) {
      setIsSidePanelOpen(!isSidePanelOpen);
    } else {
      navigate(config_element.route);
    }
  };

  const handleClose = () => setIsSidePanelOpen(!isSidePanelOpen);

  return (
    <>
      <ResponsiveHeader
        title='Catalunya Offline v2'
        logo={<img src={'images/cat_offline.png'} style={{maxHeight: '100%'}}/>}
        onStartIconClick={widescreen ? undefined : handleClose}
        isStartIconCloseable={isSidePanelOpen}
        sx={{'&.MuiAppBar-root': {zIndex: 1500}}}
      >
      </ResponsiveHeader>
      <MiniSidePanel
        actions={MINISIDEPANEL_CONFIG}
        selectedActionId={miniSidePanelSelectedActionId}
        onActionClick={handleActionClick}
        dense={!widescreen}
      />
      {
        sidePanelContent && isSidePanelOpen && <SidePanel
          drawerWidth={DRAWER_WIDTH + 'px'}
          anchor="left"
          isOpen={isSidePanelOpen}
          onClose={handleClose}
          widescreen={widescreen}
          sx={{'& .MuiPaper-root': {left: widescreen ? MINI_SIDE_PANEL_WIDTH : MINI_SIDE_PANEL_DENSE_WIDTH}}}
        >
          {sidePanelContent}
        </SidePanel>
      }
      <Main widescreen={widescreen} isleftdraweropen={sidePanelContent && isSidePanelOpen}>
        {mainContent}
      </Main>
    </>
  );
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired,
  miniSidePanelSelectedActionId: PropTypes.string.isRequired,
};

Layout.defaultProps = {
  miniSidePanelSelectedActionId: 'mapView',
};

export default Layout;
