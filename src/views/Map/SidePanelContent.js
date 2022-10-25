import React from 'react';
import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import SectionTitle from '../../components/SectionTitle';
import Geomatico from '../../components/Geomatico';

import {MAPSTYLES} from '../../config';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px',
});

const SidePanelContent = ({mapStyle, onMapStyleChanged}) => {

  return <Stack sx={{height: '100%', overflow: 'hidden'}}>
    <ScrollableContent>
      <SectionTitle titleKey='baseMapStyle'/>
      <BaseMapList
        styles={MAPSTYLES}
        selectedStyleId={mapStyle}
        onStyleChange={onMapStyleChanged}
      />
    </ScrollableContent>
    <Geomatico/>
  </Stack>;
};

SidePanelContent.propTypes = {
  mapStyle: PropTypes.string.isRequired,
  onMapStyleChanged: PropTypes.func.isRequired
};

export default SidePanelContent;

