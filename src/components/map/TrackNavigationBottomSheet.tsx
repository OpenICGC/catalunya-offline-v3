import React, {FC, useMemo, useState} from 'react';

//MUI
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//ICONS
import RemainingDistanceIcon from '@mui/icons-material/Straighten';
import ReverseDirectionIcon from '@mui/icons-material/TransferWithinAStation';
import FitBoundsIcon from '@mui/icons-material/ZoomOutMap';
import StopIcon from '../icons/NoGoTo';
import TrackDetailsIcon from '../icons/TrackDetails';
import PositiveSlopeIcon from '../icons/PositiveSlope';
import NegativeSlopeIcon from '../icons/NegativeSlope';

//GEOCOMPONETS
import BottomSheet from '@geomatico/geocomponents/Layout/BottomSheet';

//CATTOFFLINE
import ListItem from '../scope/ListItem';
import TrackProfile from '../scope/inputs/TrackProfile';
import TrackProperty from '../scope/inputs/TrackProperty';

//UTILS
import {HEXColor} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {getAccumulatedProfileProperties} from '../../utils/getAccumulatedProfileProperties';
import {getSignificantDistanceUnits} from '../../utils/getSignificantDistanceUnits';
import OutOfTrackButton from '../buttons/OutOfTrackButton';
import {Position} from 'geojson';

//STYLES
const sectionTitleSx = {
  color: 'grey.600'
};

export interface TrackNavigationBottomSheetProps {
    //track: ScopeTrack,
    name: string,
    color: HEXColor,
    coordinates?: Position[],
    currentPositionIndex?: number,
    isOutOfTrack: boolean,
    isReverseDirection: boolean,
    onReverseDirection: () => void,
    onStop: () => void,
    onShowDetails: () => void,
    onFitBounds: () => void,
    onTopChanged: (height: number) => void
}

const TrackNavigationBottomSheet: FC<TrackNavigationBottomSheetProps> = ({
  name,
  color,
  coordinates,
  currentPositionIndex,
  isOutOfTrack,
  isReverseDirection,
  onReverseDirection,
  onStop,
  onShowDetails,
  onFitBounds,
  onTopChanged
}) => {
  const {t} = useTranslation();
    
  //STYLES
  const outOfTrackSx = {
    color: isOutOfTrack ? 'grey.300' : 'grey.600'  
  };
  const [isOpen, setOpen] = useState(true);
  const actionIcons = [
    {
      id: 'toggleDirection',
      activeIcon: <ReverseDirectionIcon sx={{transform: isReverseDirection? 'scaleX(-1)' : 'scaleX(1)' }}/>,
      callback: onReverseDirection
    },
    {
      id: 'noGoTo',
      activeIcon: <StopIcon/>,
      callback: onStop
    },
    {
      id: 'details',
      activeIcon: <TrackDetailsIcon/>,
      callback: onShowDetails
    },
    {
      id: 'overview',
      activeIcon: <FitBoundsIcon/>,
      callback: onFitBounds
    }
  ];

  const coordinatesRemaining = coordinates ?
    coordinates.slice(currentPositionIndex, coordinates.length)
    : [];

  const accumsRemaining = useMemo(() => getAccumulatedProfileProperties(coordinatesRemaining), [coordinatesRemaining]);
  const distanceRemaining: string | undefined = accumsRemaining?.distance ? getSignificantDistanceUnits(accumsRemaining.distance) : undefined;
  const ascentRemaining: string | undefined = accumsRemaining?.ascent ? getSignificantDistanceUnits(accumsRemaining.ascent) : undefined;
  const descentRemaining: string | undefined = accumsRemaining?.descent  ? getSignificantDistanceUnits(accumsRemaining.descent) : undefined;

  const accums = useMemo(() => getAccumulatedProfileProperties(coordinates), [coordinates]);
  const distance: string | undefined = accums?.distance ? getSignificantDistanceUnits(accums.distance) : undefined;

  const hasElevation = coordinates ? coordinates.some(coord => coord.length >= 3) : false;

  const handleActionClick = (itemId: string, actionId: string) => actionIcons.find(actionIcons => actionIcons.id === actionId)?.callback();

  return <BottomSheet
    closedHeight={20}
    openHeight={'85vh'}
    onToggle={() => setOpen(!isOpen)}
    isOpen={isOpen}
    onTopChanged={onTopChanged}
  >
    <ListItem
      itemId="track"
      name={name}
      color={color}
      actionIcons={actionIcons}
      onActionClick={handleActionClick}
    />
    <Stack direction="column" sx={{mt: 1}}>
      <TrackProfile 
        coordinates={coordinates}
        color={color}
        currentPositionIndex={currentPositionIndex} 
        isOutOfTrack={isOutOfTrack}
      />
      <Typography sx={sectionTitleSx} variant="caption">{t('properties.remainingToGo')}</Typography>
      {
        hasElevation ?
          <Stack direction="row" justifyContent="space-around" gap={0.5} sx={{flexGrow: 1}}>
            <TrackProperty icon={<RemainingDistanceIcon sx={outOfTrackSx}/>} value={isOutOfTrack ? undefined : distanceRemaining}/>
            <TrackProperty icon={<PositiveSlopeIcon sx={outOfTrackSx}/>} value={hasElevation && isOutOfTrack ? undefined : ascentRemaining}/>
            <TrackProperty icon={<NegativeSlopeIcon sx={outOfTrackSx}/>} value={hasElevation && isOutOfTrack ? undefined : descentRemaining}/>
          </Stack>
          :
          <Stack direction="row" justifyContent="space-around" sx={{mt: 1, position: 'relative'}}>
            {isOutOfTrack && <OutOfTrackButton/>}
            <Stack alignItems="center">
              <Typography variant="h6" component="p" sx={{color: isOutOfTrack ? 'grey.300' : 'common.black'}}>{distance}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <RemainingDistanceIcon sx={outOfTrackSx}/>
                <Typography variant="body2" component="p"
                  sx={outOfTrackSx}>{t('properties.total')}</Typography>
              </Stack>
            </Stack>
            <Divider flexItem orientation="vertical"/>
            <Stack alignItems="center">
              <Typography variant="h6" component="p" sx={{color: isOutOfTrack ? 'grey.300' : 'common.black'}}>{distanceRemaining}</Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <RemainingDistanceIcon sx={outOfTrackSx}/>
                <Typography variant="body2" component="p" sx={outOfTrackSx}>{t('properties.remaining')}</Typography>
              </Stack>
            </Stack>
          </Stack>
      }
    </Stack>
  </BottomSheet>;
};

export default TrackNavigationBottomSheet;