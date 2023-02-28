import React, {FC, useState} from 'react';

//MUI
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import StraightenIcon from '@mui/icons-material/Straighten';
import FitBoundsIcon from '@mui/icons-material/ZoomOutMap';

//GEOCOMPONETS
import BottomSheet from '@geomatico/geocomponents/BottomSheet';

//CATTOFFLINE
import ListItem from '../scope/ListItem';
import ShowDetailsIcon from '../icons/MarkerDetails';
import StopIcon from '../icons/NoGoTo';

//UTILS
import {HEXColor} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {getSignificantDistanceUnits} from '../../utils/getSignificantDistanceUnits';

export interface PointNavigationBottomSheetProps {
    name: string,
    color: HEXColor,
    bearing: number,
    distance: number,
    onStop: () => void,
    onShowDetails: () => void,
    onFitBounds: () => void
}

const PointNavigationBottomSheet: FC<PointNavigationBottomSheetProps> = ({
  name,
  color,
  bearing,
  distance,
  onStop,
  onShowDetails,
  onFitBounds
}) => {
  const {t} = useTranslation();

  const [isOpen, setOpen] = useState(true);
  const actionIcons = [
    {
      id: 'stop',
      activeIcon: <StopIcon/>,
      callback: onStop
    },
    {
      id: 'showDetails',
      activeIcon: <ShowDetailsIcon/>,
      callback: onShowDetails
    },
    {
      id: 'fitBounds',
      activeIcon: <FitBoundsIcon/>,
      callback: onFitBounds
    }
  ];

  const handleActionClick = (itemId: string, actionId: string) => actionIcons.find(actionIcons => actionIcons.id === actionId)?.callback();

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
      onActionClick={handleActionClick}
    />
    <Stack direction="row" justifyContent='space-around' sx={{mt: 1}}>
      <Stack alignItems='center'>
        <Typography variant='h6' component='p'>{Math.round(bearing)}º</Typography>
        <Stack direction="row" spacing={1} alignItems='center'>
          <ArrowUpwardIcon sx={{transform: `rotate(${bearing}deg)`, color: 'grey.600'}}/>
          <Typography variant='body2' component='p' sx={{color: 'grey.600'}}>{t('properties.bearing')}</Typography>
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