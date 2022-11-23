import React, {FC, ReactNode} from 'react';

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
    p: 0,
    top: 0,
    height: '100%',
  },
  '@media (min-width: 0px)': {
    m: 0,
    top: 0,
    height: '100%',
  }
};

export type LayoutProps = {
  mainContent: ReactNode,
  sidePanelContent: ReactNode,
  isSidePanelOpen: boolean,
  onToggleSidePanel: () => void
};

const Layout: FC<LayoutProps> = ({mainContent, sidePanelContent, isSidePanelOpen, onToggleSidePanel}) => {
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
    <Main widescreen={widescreen.toString()} isleftdraweropen={(sidePanelContent && isSidePanelOpen)?.toString()}>
      {mainContent}
    </Main>
  </>;
};

export default Layout;
