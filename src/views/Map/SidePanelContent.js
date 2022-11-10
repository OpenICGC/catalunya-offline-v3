import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import Geomatico from '../../components/Geomatico';

import {MAPSTYLES} from '../../config';
import SectionTitle from '../../components/SectionTitle';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({mapStyle, onMapStyleChanged, manager}) => {

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
      {manager === 'LAYERS' &&
        <>
          <SectionTitle titleKey={'Layer Manager'}/>
          <div>TODO</div>
        </>
      }
      {manager === 'BASEMAPS' &&
        <>
          <SectionTitle titleKey={'Base Map Manager'}/>
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
          <SectionTitle titleKey={'Scope Manager'}/>
          <div>TODO</div>
        </>
      }
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired,
  manager: PropTypes.oneOf(['LAYERS', 'BASEMAPS', 'SCOPES'])
};

export default SidePanelContent;
