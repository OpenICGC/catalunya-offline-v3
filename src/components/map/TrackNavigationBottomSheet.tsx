import React, {FC, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';

//MUI-ICONS

import TransferWithinAStationIcon from '@mui/icons-material/TransferWithinAStation';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';

//GEOCOMPONETS
import BottomSheet from '@geomatico/geocomponents/BottomSheet';

//CATTOFFLINE
import ListItem from '../scope/ListItem';
import NoGoTo from '../icons/NoGoTo';
import TrackDetails from '../icons/TrackDetails';
import TrackProfile from '../scope/inputs/TrackProfile';

//UTILS
import {HEXColor} from '../../types/commonTypes';
import GeoJSON from 'geojson';

export interface TrackNavigationBottomSheetProps {
    name: string,
    color: HEXColor,
    geometry: GeoJSON.LineString,
    currentPositionIndex: number,
    isOutOfTrack: boolean,
    isReverseDirection: boolean,
    onActionClick: () => void
}

const TrackNavigationBottomSheet: FC<TrackNavigationBottomSheetProps> = ({
  name,
  color,
  geometry,
  currentPositionIndex,
  isOutOfTrack,
  isReverseDirection,
  onActionClick,
}) => {
  
  const [isOpen, setOpen] = useState(true);
  const actionIcons = [
    {
      id: 'toggleDirection',
      activeIcon: <TransferWithinAStationIcon/>
    },
    {
      id: 'noGoTo',
      activeIcon: <NoGoTo/>
    },
    {
      id: 'details',
      activeIcon: <TrackDetails/>
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
      itemId="track"
      name={name}
      color={color}
      actionIcons={actionIcons}
      onActionClick={onActionClick}
    />
    <Stack direction="column" sx={{mt: 1}}>
      <TrackProfile geometry={geometry} color={color} currentPositionIndex={currentPositionIndex} isOutOfTrack={isOutOfTrack} isReverseDirection={isReverseDirection}/>
    </Stack>
  </BottomSheet>;
};

export default TrackNavigationBottomSheet;