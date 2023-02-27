import React, {FC, useMemo} from 'react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import MapIcon from '@mui/icons-material/Map';

//GEOCOMPONETS
import BaseMapList from '../../components/common/BaseMapList';

//CATOFFLINE
import AddBaseMap from '../../components/icons/AddBaseMap';
import AddButton from '../../components/buttons/AddButton';
import Header from '../../components/common/Header';

//UTILS
import {useTranslation} from 'react-i18next';
import useTheme from '@mui/material/styles/useTheme';
import {styled} from '@mui/material/styles';
import {BASEMAPS} from '../../config';

export type BaseMapsProps = {
  isAccessibleSize: boolean,
  isLeftHanded: boolean,
  baseMapId: string,
  onMapStyleChanged: (newStyle: string) => void
  onMapStyleDeleted: (newStyle: string) => void
  onMapStyleAdded: () => void
};

const boxSx = {width: '100%', height: 0, pt: 5, pb: 1};
const BaseMaps: FC<BaseMapsProps> = ({isAccessibleSize, isLeftHanded, baseMapId, onMapStyleChanged, onMapStyleDeleted, onMapStyleAdded}) => {
  const {t} = useTranslation();
  const theme = useTheme();

  const ScrollableContent = useMemo(() => styled(Box)({
    overflowY: 'auto',
    padding: '0px',
    marginBottom: isAccessibleSize ? '72px' : '64px'
  }), [isAccessibleSize]);
  
  return <>
    <Header
      startIcon={<MapIcon/>}
      name={t('baseMapManager.title')}
      color={`#${theme.palette.secondary.main}`}
    />
    <ScrollableContent id='scrollable-baseMapList'>
      <BaseMapList
        coreStyles={BASEMAPS}
        userStyles={undefined}//TODO
        selectedStyleId={baseMapId}
        onStyleChange={onMapStyleChanged}
        onStyleDelete={onMapStyleDeleted}
      />
    </ScrollableContent>
    <Box sx={boxSx}>
      <AddButton
        isAccessibleSize={isAccessibleSize}
        isLeftHanded={isLeftHanded}
        onClick={onMapStyleAdded}
      >
        <AddBaseMap/>
      </AddButton>
    </Box>
  </>;
};

export default BaseMaps;
