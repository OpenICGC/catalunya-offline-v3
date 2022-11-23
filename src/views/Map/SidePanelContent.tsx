import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//MUI-ICONS
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';

//CATOFFLINE
import GeomaticoLink from '../../components/logos/GeomaticoLink';

//GEOCOMPONENTS
import BaseMapList from '@geomatico/geocomponents/BaseMapList';

//UTILS
import {MAPSTYLES} from '../../config';
import {Manager} from '../../types/commonTypes';
import {useTheme} from '@mui/material';
import styled from '@mui/styles/styled';
import ManagerHeader from '../../components/ManagerHeader';

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
  mapStyle: string,
  onMapStyleChanged: (newStyle: string) => void,
  manager: Manager
};

const SidePanelContent: FC<SidePanelContentProps> = ({mapStyle, onMapStyleChanged, manager}) => {
  const theme = useTheme();
  return <Stack sx={stackSx}>
    <ScrollableContent>
      {manager === 'LAYERS' &&
        <>
          <ManagerHeader
            name='layerManager'
            color={theme.palette.secondary.main}
            startIcon={<LayersIcon/>}
          />
          <div>TODO</div>
        </>
      }
      {manager === 'BASEMAPS' &&
        <>
          <ManagerHeader
            name='baseMapManager'
            color={theme.palette.secondary.main}
            startIcon={<MapIcon/>}
          />
          <BaseMapList
            styles={MAPSTYLES}
            selectedStyleId={mapStyle}
            onStyleChange={onMapStyleChanged}
            variant='list'
          />
        </>
      }
      {manager === 'SCOPES' &&
        <>
          <ManagerHeader
            name='scopeManager'
            color={theme.palette.secondary.main}
            startIcon={<FolderIcon/>}
          />
          <div>TODO</div>
        </>
      }
    </ScrollableContent>
    <GeomaticoLink/>
  </Stack>;
};

export default SidePanelContent;
