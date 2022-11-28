import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';

//UTILS
import {Manager} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import Scopes from './sidepanels/Scopes';

//STYLES
const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '0px'
});

const stackSx = {
  height: '100%',
  overflow: 'hidden',
  m: 0,
  p: 0
};

export type SidePanelContentProps = {
  manager: Manager,
  mapStyle: string,
  onMapStyleChanged: (newStyle: string) => void
};

const SidePanelContent: FC<SidePanelContentProps> = ({manager, mapStyle, onMapStyleChanged}) => {
  return <Stack sx={stackSx}>
    <ScrollableContent>
      {manager === 'LAYERS' &&
        <Layers/>
      }
      {manager === 'BASEMAPS' &&
        <BaseMaps
          mapStyle={mapStyle}
          onMapStyleChanged={onMapStyleChanged}
        />
      }
      {manager === 'SCOPES' &&
        <Scopes/>
      }
    </ScrollableContent>
  </Stack>;
};

export default SidePanelContent;
