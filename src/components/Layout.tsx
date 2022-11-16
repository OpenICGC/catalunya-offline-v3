import React, {FC} from 'react';
import PropTypes from 'prop-types';

import styled from '@mui/styles/styled';
import useMediaQuery from '@mui/material/useMediaQuery';
import Box from '@mui/material/Box';

import SidePanel from '@geomatico/geocomponents/SidePanel';

import {
  DRAWER_WIDTH,
  SM_BREAKPOINT,
} from '../config';

const Main = styled(Box)({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0
}) as React.ElementType;

const sidePanelSx = {
  '& .MuiDrawer-paper': {
    top: 0,
    height: '100%',
  },
  '@media (min-width: 0px)': {
    top: 0,
    height: '100%',
  }
};

type Props = {
  mainContent: React.ReactElement,
  sidePanelContent: React.ReactElement,
  isSidePanelOpen: boolean,
  onToggleSidePanel: ()=> void
};

const Layout: FC<Props> = ({mainContent, sidePanelContent, isSidePanelOpen, onToggleSidePanel}) => {
  const widescreen = useMediaQuery(`@media (min-width:${SM_BREAKPOINT}px)`, {noSsr: true});

  return <>
    {sidePanelContent && isSidePanelOpen &&
      <SidePanel
        sx={sidePanelSx}
        drawerWidth={DRAWER_WIDTH + 'px'}
        anchor="left"
        isOpen={isSidePanelOpen}
        onClose={onToggleSidePanel}
        widescreen={widescreen}
      >
        {sidePanelContent}
      </SidePanel>
    }
    <Main widescreen={widescreen.toString()} isleftdraweropen={(sidePanelContent && isSidePanelOpen).toString()}>
      {mainContent}
    </Main>
  </>;
};

Layout.propTypes = {
  sidePanelContent: PropTypes.element.isRequired,
  mainContent: PropTypes.element.isRequired,
  isSidePanelOpen: PropTypes.bool.isRequired,
  onToggleSidePanel: PropTypes.func.isRequired
};

export default Layout;
