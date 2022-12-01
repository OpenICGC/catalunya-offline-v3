import React, {FC} from 'react';

//MUI
import Stack from '@mui/material/Stack';

//UTILS
import {Manager} from '../types/commonTypes';
import Layers from './sidepanels/Layers';
import BaseMaps from './sidepanels/BaseMaps';
import ScopeMain from './sidepanels/ScopeMain';

//STYLES
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
      <ScopeMain/>
    }
  </Stack>;
};

export default SidePanelContent;
