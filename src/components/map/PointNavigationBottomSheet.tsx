import React, {FC, useState} from 'react';

//MUI
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StraightenIcon from '@mui/icons-material/Straighten';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

//GEOCOMPONETS
import BottomSheet from '@geomatico/geocomponents/BottomSheet';

//CATTOFFLINE
import ListItem from '../scope/ListItem';
import MarkerDetails from '../icons/MarkerDetails';
import NoGoTo from '../icons/NoGoTo';

//UTILS
import {HEXColor} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {getSignificantDistanceUnits} from '../../utils/getSignificantDistanceUnits';

export interface PointNavigationBottomSheetProps {
    name: string,
    color: HEXColor,
    course: number,
    distance: number,
    onActionClick: () => void
}

const PointNavigationBottomSheet: FC<PointNavigationBottomSheetProps> = ({
  name,
  color,
  course,
  distance,
  onActionClick
}) => {
  const {t} = useTranslation();

  const [isOpen, setOpen] = useState(true);
  const actionIcons = [
    {
      id: 'noGoTo',
      activeIcon: <NoGoTo/>
    },
    {
      id: 'details',
      activeIcon: <MarkerDetails/>
    },
    {
      id: 'overview',
      activeIcon: <ZoomOutMapIcon/>
    }
  ];

  return <BottomSheet
    closedHeight={20}
    openHeight={'80vh'}
    onToggle={() => setOpen(!isOpen)}
    isOpen={isOpen}
  >
    <ListItem
      itemId="point"
      name={name}
      color={color}
      actionIcons={actionIcons}
      onActionClick={onActionClick}
    />
    <Stack direction="row" justifyContent='space-around' sx={{mt: 1}}>
      <Stack alignItems='center'>
        <Typography variant='h6' component='p'>{course}º</Typography>
        <Stack direction="row" spacing={1} alignItems='center'>
          <ArrowUpwardIcon sx={{transform: `rotate(${course}deg)`, color: 'grey.600'}}/>
          <Typography variant='body2' component='p' sx={{color: 'grey.600'}}>{t('properties.course')}</Typography>
        </Stack>
      </Stack>
      <Divider flexItem orientation='vertical'/>
      <Stack alignItems='center'>
        <Typography variant='h6' component='p'>{getSignificantDistanceUnits(distance)}</Typography>
        <Stack direction="row" spacing={1} alignItems='center'>
          <StraightenIcon sx={{color: 'grey.600'}}/>
          <Typography variant='body2' component='p' sx={{color: 'grey.600'}}>{t('properties.distance')}</Typography>
        </Stack>
      </Stack>
    </Stack>
  </BottomSheet>;
};

export default PointNavigationBottomSheet;