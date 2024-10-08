import React, {FC, ReactNode} from 'react';

import styled from '@mui/material/styles/styled';
import Box from '@mui/material/Box';

import SidePanel from '@geomatico/geocomponents/Layout/SidePanel';

import {
  DRAWER_WIDTH,
} from '../config';
import useIsLeftHanded from '../hooks/settings/useIsLeftHanded';

const Main = styled(Box)({
  flexGrow: 1,
  padding: 0,
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0
}) as React.ElementType;

const sidePanelSx = (isOpen: boolean) => ({
  '& .MuiDrawer-paper': {
    transform: `translateX(${isOpen ? -DRAWER_WIDTH : 0}px)`,
    transition: 'transform 0.1s',
    p: 0,
    top: 0,
    height: '100%',
  },
  '@media (min-width: 0px)': {
    m: 0,
    top: 0,
    height: '100%',
  }
});

export type LayoutProps = {
  mainContent: ReactNode,
  sidePanelContent: ReactNode,
  isSidePanelOpen: boolean,
  onToggleSidePanel: () => void
};

const Layout: FC<LayoutProps> = ({mainContent, sidePanelContent, isSidePanelOpen, onToggleSidePanel}) => {
  const [isLeftHanded] = useIsLeftHanded();
  return <>
    <SidePanel
      sx={sidePanelSx(!!sidePanelContent && isSidePanelOpen)}
      drawerWidth={DRAWER_WIDTH + 'px'}
      anchor={isLeftHanded ? 'right' : 'left'}
      isOpen={!!sidePanelContent && isSidePanelOpen}
      onClose={onToggleSidePanel}
      widescreen={false}
    >
      {sidePanelContent || <></>}
    </SidePanel>
    <Main>
      {mainContent}
    </Main>
  </>;
};

export default React.memo(Layout);
