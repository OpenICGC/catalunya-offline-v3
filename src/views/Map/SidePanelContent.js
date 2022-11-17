import React from 'react';
import PropTypes from 'prop-types';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

//MUI-ICONS
import FolderIcon from '@mui/icons-material/Folder';
import LayersIcon from '@mui/icons-material/Layers';
import MapIcon from '@mui/icons-material/Map';

//CATOFFLINE
import GeomaticoLink from '../../components/GeomaticoLink';
import ManagerHeader from '../../components/ManagerHeader';

//GEOCOMPONENTS
import BaseMapList from '@geomatico/geocomponents/BaseMapList';

//UTILS
import {MAPSTYLES} from '../../config';
import {useTheme} from '@mui/material';
import styled from '@mui/styles/styled';

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

const SidePanelContent = ({mapStyle, onMapStyleChanged, manager}) => {
  const theme = useTheme();
  return <Stack sx={stackSx}>
    <ScrollableContent>
      {manager === 'LAYERS' &&
        <>
          <ManagerHeader
            name='layerManager'
            color={theme.palette.secondary.main}
            startIcon={<LayersIcon sx={{color: theme => theme.palette.getContrastText(theme.palette.secondary.main)}}/>}
          />
          <div>TODO</div>
        </>
      }
      {manager === 'BASEMAPS' &&
        <>
          <ManagerHeader
            name='baseMapsManager'
            color={theme.palette.secondary.main}
            startIcon={<MapIcon sx={{color: theme => theme.palette.getContrastText(theme.palette.secondary.main)}}/>}
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
            startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText(theme.palette.secondary.main)}}/>}
          />
          <div>TODO</div>
        </>
      }
    </ScrollableContent>
    <GeomaticoLink/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired,
  manager: PropTypes.oneOf(['LAYERS', 'BASEMAPS', 'SCOPES']).isRequired
};

export default SidePanelContent;

