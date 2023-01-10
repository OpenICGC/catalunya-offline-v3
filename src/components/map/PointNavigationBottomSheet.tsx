import React, {FC, useState} from 'react';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StraightenIcon from '@mui/icons-material/Straighten';
import BottomSheet from '@geomatico/geocomponents/BottomSheet';
import ListItem from '../scope/ListItem';
import {HEXColor} from '../../types/commonTypes';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import {useTranslation} from 'react-i18next';
import NoGoTo from '../icons/NoGoTo';


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
      activeIcon: <ContentPasteSearchIcon/>
    },
    {
      id: 'overview',
      activeIcon: <ZoomOutMapIcon/>
    }
  ];

  const distanceWithUnits = distance > 10000 ?
    distance > 1000000? `${(distance/1000).toFixed()} km`
      : `${distance/1000} km`
    : `${distance} m`;

  return <BottomSheet
    closedHeight={20}
    openHeight={'80vh'}
    onToggle={() => setOpen(!isOpen)}
    isOpen={isOpen}
    swipeableStyleProps={{}}
  >
    <ListItem
      itemId="point"
      name={name}
      color={color}
      actionIcons={actionIcons}
      onActionClick={onActionClick}
      onColorChange={() => console.log('You can\'t change the color at this point')}
      onNameChange={() => console.log('You can\'t change the name at this point')}
    />
    <Stack direction="row" justifyContent='space-around' sx={{mt: 1}}>
      <Stack alignItems='center'>
        <Typography variant='h6' component='p'>{course}º</Typography>
        <Stack direction="row" spacing={1} alignItems='center'>
          <IconButton size='small' >
            <ArrowUpwardIcon sx={{transform: `rotate(${course}deg)`}}/>
          </IconButton>
          <Typography variant='body2' component='p' sx={{color: 'grey.600'}}>{t('properties.course')}</Typography>
        </Stack>
      </Stack>
      <Divider flexItem orientation='vertical'/>
      <Stack alignItems='center'>
        <Typography variant='h6' component='p'>{distanceWithUnits}</Typography>
        <Stack direction="row" spacing={1} alignItems='center'>
          <IconButton size='small'>
            <StraightenIcon/>
          </IconButton>
          <Typography variant='body2' component='p' sx={{color: 'grey.600'}}>{t('properties.distance')}</Typography>
        </Stack>
      </Stack>
    </Stack>
  </BottomSheet>;
};

export default PointNavigationBottomSheet;