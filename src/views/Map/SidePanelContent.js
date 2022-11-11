import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import SectionTitle from '../../components/SectionTitle';
import GeomaticoLink from '../../components/GeomaticoLink';

import {MAPSTYLES} from '../../config';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px'
});

const stackSx = {
  height: '100%',
  overflow: 'hidden'
};

const SidePanelContent = ({mapStyle, onMapStyleChanged, manager}) =>
  <Stack sx={stackSx}>
    <ScrollableContent>
      {manager === 'LAYERS' &&
        <>
          <SectionTitle titleKey='layerManager'/>
          <div>TODO</div>
        </>
      }
      {manager === 'BASEMAPS' &&
        <>
          <SectionTitle titleKey='baseMapManager'/>
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
          <SectionTitle titleKey='scopeManager'/>
          <div>TODO</div>
        </>
      }
    </ScrollableContent>
    <GeomaticoLink/>
  </Stack>;

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired,
  manager: PropTypes.oneOf(['LAYERS', 'BASEMAPS', 'SCOPES']).isRequired
};

export default SidePanelContent;

