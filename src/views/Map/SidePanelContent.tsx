import React, {Dispatch, FC, SetStateAction} from 'react';

import Stack from '@mui/material/Stack';

import BaseMapList from '@geomatico/geocomponents/BaseMapList';
import Box from '@mui/material/Box';
import styled from '@mui/styles/styled';

import SectionTitle from '../../components/SectionTitle';
import GeomaticoLink from '../../components/GeomaticoLink';

import {MAPSTYLES} from '../../config';
import {Manager} from '../../types/commonTypes';

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '8px'
});

const stackSx = {
  height: '100%',
  overflow: 'hidden'
};

export type SidePanelContentProps = {
  mapStyle: string,
  onMapStyleChanged: Dispatch<SetStateAction<string>>,
  manager: Manager,
};

const SidePanelContent: FC<SidePanelContentProps> = ({mapStyle, onMapStyleChanged, manager}) =>
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

export default SidePanelContent;

