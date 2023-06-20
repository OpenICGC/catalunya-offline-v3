import React, {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import AvTimerIcon from '@mui/icons-material/AvTimer';
import EditIcon from '@mui/icons-material/Edit';
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
import PositiveSlope from '../icons/PositiveSlope';
import NegativeSlope from '../icons/NegativeSlope';

//OTHERS
import moment from 'moment/moment';
import 'moment-duration-format';

//UTILS
import {HEXColor, Scope, ImagePath, ScopeTrack, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/material/styles/styled';
import {getAccumulatedProfileProperties} from '../../utils/getAccumulatedProfileProperties';
import useImages from '../../hooks/useImages';
import {IS_WEB} from '../../config';
import {openPhoto} from '../../utils/camera';
import {getSignificantDistanceUnits} from '../../utils/getSignificantDistanceUnits';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';

//STYLES
const sectionWrapperSx = {
  padding: '8px',
  marginBottom: '0px'
};
const sectionTitleSx = {
  color: 'grey.600'
};
const sxInput = {
  '&.GenericInput-wrapper': sectionWrapperSx,
  '& .GenericInput-title': sectionTitleSx
};

const textFieldNoEditableSx = {
  borderRadius: '4px',
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding: '8px',
    fontSize: '0.875rem',
    minWidth: '25px',
    cursor: 'default'
  }
};

const textFieldEditableSx = {
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    outline: '0px solid white',
    padding: '8px',
    fontSize: '0.875rem',
    minWidth: '30px'
  }
};

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '0px',
  marginBottom: '32px'
});

export type TrackPanelProps = {
  isActive: boolean,
  scope: Scope,
  track: ScopeTrack,
  numPoints: number,
  numTracks: number,
  isEditing: boolean,
  onEditing: (isEditing: boolean) => void,
  onRecordStart: () => void,
  onTrackChange: (newTrack: ScopeTrack) => void,
  onBackButtonClick: () => void,
  onGoTo: (pointId: UUID) => void,
};

const TrackPanel: FC<TrackPanelProps> = ({
  isActive,
  scope,
  track,
  numPoints,
  numTracks,
  isEditing,
  onEditing,
  onRecordStart,
  onTrackChange,
  onBackButtonClick,
  onGoTo
}) => {
  const {t} = useTranslation();
  const [uneditedTrack, setUneditedTrack] = useState<ScopeTrack>();
  const {images, create, remove, save, discard} = useImages(track.properties.images);

  const accums = useMemo(() => getAccumulatedProfileProperties(track.geometry?.coordinates), [track]);
  const distance: string | undefined = accums ? getSignificantDistanceUnits(accums.distance) : undefined;
  const ascent: string | undefined = accums ? getSignificantDistanceUnits(accums.ascent) : undefined;
  const descent: string | undefined = accums ? getSignificantDistanceUnits(accums.descent) : undefined;
  const formattedTime = accums?.time ? moment.duration(accums?.time, 'seconds').format('h[h] mm[m] ss[s]') : undefined;

  const hasElevation = track.geometry ? track.geometry.coordinates.some(coord => coord.length >= 3) : false;
  const hasTimestamp = track.geometry && track.geometry.coordinates.length ? !!track.geometry.coordinates[track.geometry.coordinates.length - 1][3] : false;

  useEffect(() => {
    if (isEditing) {
      setUneditedTrack(track);
    }
  }, [isEditing]);

  const actionIcons = useMemo(() => ([
    {
      id: 'rename',
      activeIcon: <EditIcon/>
    },
    {
      id: 'goTo',
      activeIcon: <SwipeRightAltIcon/>,
      disabled: !track.geometry
    }
  ]), [track.geometry]);

  // HANDLERS
  const handleActionClick = useCallback((trackId: string, actionId: string) => {
    actionId === 'rename' ? onEditing(true) : onGoTo(trackId);
  }, []);

  const handleColorChange = useCallback((trackId: UUID, color: HEXColor) =>
    onTrackChange({
      ...track,
      properties: {
        ...track.properties,
        color: color
      }
    }), [track]);

  const handleNameChange = useCallback((trackId: UUID, name: string) =>
    onTrackChange({
      ...track,
      properties: {
        ...track.properties,
        name: name
      }
    }), [track]);


  const handleDateChange = useCallback((value: number) =>
    value && onTrackChange({
      ...track,
      properties: {
        ...track.properties,
        timestamp: value // timestamp in milliseconds
      }
    }), [track]);

  const handleDescriptionChange = useCallback((value: string) =>
    onTrackChange({
      ...track,
      properties: {
        ...track.properties,
        description: value
      }
    }), [track]);

  const handleSchemaValueChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, schemaFieldId: string) =>
    onTrackChange({
      ...track,
      schemaValues: {
        ...track.schemaValues,
        [schemaFieldId]: e.target.value
      }
    }), [track]);

  const handleAddImage = () => create();

  const handleDeleteImage = (image: ImagePath) => remove(image);

  const handleOpenImage = (image: ImagePath) => openPhoto(images, image);

  const handleAccept = () => {
    save();
    onTrackChange({
      ...track,
      properties: {
        ...track.properties,
        images
      }
    });
    onEditing(false);
  };

  const handleCancel = () => {
    discard();
    uneditedTrack && onTrackChange(uneditedTrack);
    onEditing(false);
  };

  const backIcon = useMemo(() => <ArrowBackIcon sx={{transform: 'rotate(180deg)'}}/>, []);
  const trackSchema = useMemo(() => scope.schema?.filter(
    field => field.appliesToTracks), [scope]);

  return (isActive || isEditing) ? <>
    <Header
      startIcon={isEditing ? <></> : backIcon}
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
        isVisible={track.properties.isVisible}
        isEditing={isEditing}
        actionIcons={actionIcons}
        onActionClick={handleActionClick}
        onColorChange={handleColorChange}
        onNameChange={handleNameChange}
      />
    </Box>
    <ScrollableContent>
      <Stack sx={sectionWrapperSx}>
        {!track.geometry && <>
          <Typography sx={sectionTitleSx} variant="caption">
            {t('properties.recordingTrack')}
          </Typography>
          <Box>
            <RecordButton onClick={onRecordStart}/>
          </Box>
        </>}
        {track.geometry && track.geometry.coordinates.length && <>
          <Typography sx={sectionTitleSx} variant="caption">
            {t('properties.detailsTrack')}
          </Typography>
          <Stack>
            <Stack direction="row" sx={{justifyContent: 'space-between'}}>
              { track.geometry &&
                <GeometryThumbnail geometry={track.geometry} color={track.properties.color || scope.color} size={50}/>
              }
              <Stack direction="row" justifyContent="space-between" gap={0.5} sx={{flexGrow: 1}}>
                <Stack direction="column" sx={{justifyContent: 'space-between'}}>
                  <TrackProperty icon={<StraightenIcon/>} value={distance}/>
                  {/*if it does not have elevation, it does not have time either*/}
                  <TrackProperty icon={<AvTimerIcon/>} value={hasTimestamp && formattedTime}/>
                </Stack>
                <Stack direction="column" sx={{justifyContent: 'space-between'}}>
                  <TrackProperty icon={<PositiveSlope/>} value={hasElevation && ascent}/>
                  <TrackProperty icon={<NegativeSlope/>} value={hasElevation && descent}/>
                </Stack>
              </Stack>
            </Stack>
            <TrackProfile coordinates={track.geometry.coordinates} color={track.properties.color || scope.color} isOutOfTrack={false}/>
          </Stack>
        </>}
      </Stack>
      <DateInput isEditing={isEditing} onChange={handleDateChange} timestamp={track.properties.timestamp} sx={sxInput}/>
      <TextAreaInput isEditing={isEditing} onChange={handleDescriptionChange} text={track.properties.description} sx={sxInput}/>
      {!IS_WEB && <ImageInput isEditing={isEditing}
        images={images}
        sx={sxInput}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
        onDownloadImage={handleOpenImage}
      />}
      {
        trackSchema && trackSchema.map(field => <Stack sx={sectionWrapperSx} key={field.id} id={field.id}>
          <Typography sx={sectionTitleSx} variant='caption'>{field.name}</Typography>
          { isEditing
            ? <TextField size='small' label='' variant='outlined' sx={textFieldEditableSx}
              onChange={(e) => handleSchemaValueChange(e,field.id)}
              value={track.schemaValues && track.schemaValues[field.id]}/>
            : <InputBase inputProps={{ readOnly: true }} sx={textFieldNoEditableSx}
              defaultValue={track.schemaValues ? track.schemaValues[field.id] : '-'}
            />
          }
        </Stack>
        )
      }
    </ScrollableContent>
    {isEditing &&
      <Stack direction="row" justifyContent="center" gap={1} sx={{px: 1, pb: 2}}>
        <CancelButton onCancel={handleCancel}/>
        <AcceptButton disabled={false} onAccept={handleAccept}/>
      </Stack>
    }
  </> : null;
};

export default React.memo(TrackPanel);
