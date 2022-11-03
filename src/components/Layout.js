import React, {useState} from 'react';
import PropTypes from 'prop-types';

import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';
import ResponsiveHeader from '@geomatico/geocomponents/ResponsiveHeader';
import SidePanel from '@geomatico/geocomponents/SidePanel';

import {
  DRAWER_WIDTH,
  SM_BREAKPOINT,
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
  left: widescreen ? (isleftdraweropen && DRAWER_WIDTH) : 0
}));

const Layout = ({mainContent, sidePanelContent}) => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(widescreen);

  const handleClose = () => setIsSidePanelOpen(!isSidePanelOpen);

  return (
    <>
      <ResponsiveHeader
        title='Catalunya Offline'
        logo={<img src={'images/logo.svg'} style={{maxHeight: '90%', backgroundColor: '#FFF', boxShadow: 'rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px'}}/>}
        onStartIconClick={widescreen ? undefined : handleClose}
        isStartIconCloseable={isSidePanelOpen}
        sx={{
          '&.MuiAppBar-root': {zIndex: 1500}
        }}
      >
      </ResponsiveHeader>
      {
        sidePanelContent && isSidePanelOpen && <SidePanel
          drawerWidth={DRAWER_WIDTH + 'px'}
          anchor="left"
          isOpen={isSidePanelOpen}
          onClose={handleClose}
          widescreen={widescreen}
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
  mainContent: PropTypes.element.isRequired
};

export default Layout;
