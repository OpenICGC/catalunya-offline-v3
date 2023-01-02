import React, {ChangeEvent, FC, useCallback, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import EditIcon from '@mui/icons-material/Edit';
import LandscapeIcon from '@mui/icons-material/Landscape';
import StraightenIcon from '@mui/icons-material/Straighten';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';

//CATOFFLINE
import AcceptButton from '../buttons/AcceptButton';
import CancelButton from '../buttons/CancelButton';
import DateInput from './inputs/DateInput';
import FeaturesSummary from './FeaturesSummary';
import GeometryThumbnail from './inputs/GeometryThumbnail';
import Header from '../common/Header';
import ImageInput from './inputs/ImageInput';
import ListItem from './ListItem';
import RecordButton from '../buttons/RecordButton';
import TextAreaInput from './inputs/TextAreaInput';
import TrackProfile from './inputs/TrackProfile';
import TrackProperty from './inputs/TrackProperty';

//OTHERS
import moment, {Moment} from 'moment/moment';
import 'moment-duration-format';

//UTILS
import {HEXColor, Scope, ScopeTrack, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/styles/styled';
import {getAccumulatedTrackProperties} from '../../utils/getAccumulatedTrackProperties';

//STYLES
const sectionWrapperSx = {
  padding: '8px',
  marginBottom: '0px',
};
const sectionTitleSx = {
  color: 'grey.600',
};
const sxInput = {
  '&.GenericInput-wrapper': sectionWrapperSx,
  '& .GenericInput-title': sectionTitleSx
};

export type TrackPanelProps = {
    isAccessibleSize: boolean,
  scope: Scope,
  initialTrack: ScopeTrack,
  numPoints: number,
  numTracks: number,
    onAddImage: () => void,
    onDeleteImage: (imageId: UUID) => void,
    onDownloadImage: (imageId: UUID, contentType: string) => void,
    onRecordStart: () => void,
    onTrackChange: (newPoint: ScopeTrack) => void,
  onBackButtonClick: () => void,
    onGoTo: (pointId: UUID) => void,
};

const TrackPanel: FC<TrackPanelProps> = ({
  isAccessibleSize,
  scope,
  initialTrack,
  numPoints,
  numTracks,
  onAddImage,
  onDeleteImage,
  onDownloadImage,
  onRecordStart,
  onTrackChange,
  onBackButtonClick,
  onGoTo
}) => {
  const {t} = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [track, setTrack] = useState(initialTrack);

  const distance: string | undefined = getAccumulatedTrackProperties(track)?.distance.toFixed(2)+' km';
  const ascent: string | undefined = getAccumulatedTrackProperties(track)?.ascent+' m';
  const descent: string | undefined = getAccumulatedTrackProperties(track)?.descent+' m';
  const time: number | undefined = getAccumulatedTrackProperties(track)?.time;
  const durationTime = moment.duration(time, 'seconds');
  const formattedTime = durationTime.format('hh[h] mm[m] ss[s]');

  const actionIcons = [
    {
      id: 'rename',
      activeIcon: <EditIcon/>,
    },
    {
      id: 'goTo',
      activeIcon: <SwipeRightAltIcon/>,
      disabled: !track.geometry
    }
  ];

  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isEditing ? '32px' : '16px',
  }), [isEditing]);

  // HANDLERS
  const handleActionClick = useCallback((trackId: string, actionId: string) => {
    actionId === 'rename' ? setIsEditing(true) : onGoTo(trackId);
  }, []);

  const handleColorChange = useCallback((trackId: UUID, color: HEXColor) =>
    setTrack(prevTrack => ({
      ...prevTrack,
      properties: {
        ...prevTrack.properties,
        color: color
      }
    })), []);

  const handleNameChange = useCallback((trackId: UUID, name: string) =>
    setTrack(prevTrack => ({
      ...prevTrack,
      properties: {
        ...prevTrack.properties,
        name: name
      }
    })), []);

  const handleDateChange = useCallback((value: Moment | null) =>
    value && setTrack(prevTrack => ({
      ...prevTrack,
      properties: {
        ...prevTrack.properties,
        timestamp: value.toDate().getTime()
      }
    })), []);

  const handleDescriptionChange = useCallback((value: ChangeEvent<HTMLTextAreaElement>) =>
    setTrack(prevTrack => ({
      ...prevTrack,
      properties: {
        ...prevTrack.properties,
        description: value.target.value
      }
    })), []);

  const handleAccept = () => {
    onTrackChange(track);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTrack(initialTrack);
    setIsEditing(false);
  };

  return <>
    <Header
      startIcon={<ArrowBackIcon sx={{transform: 'rotate(180deg)'}}/>}
      name={scope.name}
      color={scope.color}
      onStartIconClick={onBackButtonClick}
    >
      <FeaturesSummary numPoints={numPoints} numTracks={numTracks} colorContrastFrom={scope.color}/>
    </Header>
    <Box>{/*makes up&down margin*/}
      <ListItem
        itemId={track.id}
        name={track.properties.name}
        color={track.properties.color || scope.color}
        isActive={track.properties.isVisible}
        isEditing={isEditing}
        actionIcons={actionIcons}
        onActionClick={handleActionClick}
        onColorChange={handleColorChange}
        onNameChange={handleNameChange}
      />
    </Box>
    <ScrollableContent>
      <Stack sx={sectionWrapperSx}>
        <Typography sx={sectionTitleSx} variant='caption'>
          {!track.geometry ? t('properties.recordingTrack') : t('properties.detailsTrack')}
        </Typography>
        {
          !track.geometry ?
            <Box>
              <RecordButton isAccessibleSize={isAccessibleSize} onClick={onRecordStart}/> 
            </Box> :
            <Stack>
              <Stack direction='row' sx={{justifyContent: 'space-between'}}>
                { track.geometry && <GeometryThumbnail geometry={track.geometry} color={track.properties.color} size={50}/> }
                <Stack direction='row' justifyContent='space-between' gap={1} sx={{flexGrow: 1}}>
                  <Stack direction='column' sx={{justifyContent: 'space-between'}}>
                    <TrackProperty icon={<StraightenIcon/>} value={distance}/>
                    <TrackProperty icon={<AvTimerIcon/>} value={formattedTime}/>
                  </Stack>
                  <Stack direction='column' sx={{justifyContent: 'space-between'}}>
                    <TrackProperty icon={<LandscapeIcon/>} value={ascent}/>
                    <TrackProperty icon={<LandscapeIcon/>} value={descent}/>
                  </Stack>
                </Stack>
              </Stack>
              <TrackProfile track={track} color={track.properties.color}/>
            </Stack>
        }
      </Stack>
      <DateInput isEditing={isEditing} onChange={handleDateChange} feature={track} sx={sxInput}/>
      <TextAreaInput isEditing={isEditing} onChange={handleDescriptionChange} feature={track} sx={sxInput}/>
      <ImageInput isEditing={isEditing} feature={track} sx={sxInput}
        onAddImage={onAddImage}
        onDeleteImage={onDeleteImage}
        onDownloadImage={onDownloadImage}
      />
    </ScrollableContent>
    { isEditing &&
      <Stack direction="row" justifyContent="center" gap={1} sx={{px: 1, pb: 2}}>
        <CancelButton isAccessibleSize={false} onCancel={handleCancel}/>
        <AcceptButton isAccessibleSize={false} disabled={false} onAccept={handleAccept}/>
      </Stack>
    }
  </>;
};

export default TrackPanel;
