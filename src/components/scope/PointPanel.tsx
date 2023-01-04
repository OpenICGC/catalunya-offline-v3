import React, {ChangeEvent, FC, useCallback, useEffect, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import EditIcon from '@mui/icons-material/Edit';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';

//CATOFFLINE
import Header from '../common/Header';
import ListItem from './ListItem';
import CancelButton from '../buttons/CancelButton';
import AcceptButton from '../buttons/AcceptButton';
import DateInput from './inputs/DateInput';
import TextAreaInput from './inputs/TextAreaInput';
import ImageInput from './inputs/ImageInput';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, Scope, ScopeImage, ScopePoint, UUID} from '../../types/commonTypes';
import styled from '@mui/styles/styled';

import FeaturesSummary from './FeaturesSummary';
import {useScopeImages} from '../../hooks/useScopeImages';
import {IS_WEB} from '../../config';

//STYLES
const sectionWrapperSx = {
  padding: '8px',
  marginBottom: '0px',
};
const sectionTitleSx = {
  color: 'grey.600',
};
const coordTitle = {
  color: 'grey.500'
};
const sxInput = {
  '&.GenericInput-wrapper': sectionWrapperSx,
  '& .GenericInput-title': sectionTitleSx
};

const CoordsFieldEditable = styled(TextField)({
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    textAlign: 'center',
    outline: '0px solid white',
    padding: '4px',
    fontSize: '0.875rem',
    minWidth: '30px'
  }
});

const CoordsFieldNoEditable = styled(InputBase)({
  borderRadius: '4px',
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    textAlign: 'center',
    padding: '4px',
    fontSize: '0.875rem',
    minWidth: '25px',
    cursor: 'default'
  }
});

const Location = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const actionIcons = [
  {
    id: 'rename',
    activeIcon: <EditIcon/>,
  },
  {
    id: 'goTo',
    activeIcon: <SwipeRightAltIcon/>,
  }
];

export type PointPanelProps = {
    scope: Scope,
    initialPoint: ScopePoint,
    numPoints: number,
    numTracks: number,
    onBackButtonClick: () => void,
    onPointChange: (newPoint: ScopePoint) => void,
    onGoTo: (pointId: UUID) => void,
    onDownloadImage: (image: ScopeImage) => void,
    onAddPrecisePosition: () => void
};

const PointPanel: FC<PointPanelProps> = ({
  scope,
  initialPoint,
  numPoints,
  numTracks,
  onBackButtonClick,
  onPointChange,
  onGoTo,
  onDownloadImage,
  onAddPrecisePosition
}) => {
  const {t} = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const [point, setPoint] = useState(initialPoint);
  const {images, create, remove, save, discard} = useScopeImages(initialPoint.properties.images);

  useEffect(() => {
    setPoint(prevPoint => ({
      ...prevPoint,
      geometry: {
        ...prevPoint.geometry,
        coordinates: initialPoint.geometry.coordinates
      }
    }));
  }, [initialPoint.geometry.coordinates]);

  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isEditing ? '32px' : '16px',
  }), [isEditing]);

  const precisePositionIconSx = useMemo(() => ({
    '&:hover': {
      bgcolor: !isEditing ? 'common.white' : undefined,
      cursor: !isEditing ? 'default' : undefined
    }
  }), [isEditing]);


  // VALIDATORS
  const [lon, lat] = point.geometry.coordinates;
  const isNameValid = point.properties.name.length > 0;
  const isLongitudeValid = lon >= -180 && lon <= 180;
  const isLatitudeValid = lat >= -90 && lat <= 90;
  const isFormValid = isNameValid && isLatitudeValid && isLongitudeValid;


  // HANDLERS
  const handleActionClick = useCallback((pointId: string, actionId: string) => {
    actionId === 'rename' ? setIsEditing(true) : onGoTo(pointId);
  }, []);
  
  const handleColorChange = useCallback((pointId: UUID, color: HEXColor) =>
    setPoint(prevPoint => ({
      ...prevPoint,
      properties: {
        ...prevPoint.properties,
        color: color
      }
    })), []);

  const handleNameChange = useCallback((pointId: UUID, name: string) =>
    setPoint(prevPoint => ({
      ...prevPoint,
      properties: {
        ...prevPoint.properties,
        name: name
      }
    })), []);

  const handleDateChange = useCallback((value: number) =>
    value && setPoint(prevPoint => ({
      ...prevPoint,
      properties: {
        ...prevPoint.properties,
        timestamp: value
      }
    })), []);

  const handleDescriptionChange = useCallback((value: string) =>
    setPoint(prevPoint => ({
      ...prevPoint,
      properties: {
        ...prevPoint.properties,
        description: value
      }
    })), []);

  const handleCoordinatesChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, coordIndex: number) =>
    setPoint(prevPoint => {
      const newCoords = [...prevPoint.geometry.coordinates];
      (e.target.value === '' || e.target.value === '-') ?
        coordIndex === 2 ? newCoords.pop() : 0
        : newCoords[coordIndex] = parseFloat(e.target.value);
      return {
        ...prevPoint,
        geometry: {
          type: 'Point',
          coordinates: newCoords
        }
      };
    }), []);

  const handleAddImage = () => create();

  const handleDeleteImage = (image: ScopeImage) => remove(image);

  const handleAccept = () => {
    save();
    onPointChange({
      ...point,
      properties: {
        ...point.properties,
        images
      }
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    discard();
    setPoint(initialPoint);
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
        itemId={point.id}
        name={point.properties.name}
        color={point.properties.color || scope.color}
        isActive={point.properties.isVisible}
        isEditing={isEditing}
        actionIcons={actionIcons}
        onActionClick={handleActionClick}
        onColorChange={handleColorChange}
        onNameChange={handleNameChange}
      />
    </Box>
    <ScrollableContent>
      <Stack sx={sectionWrapperSx} id='location'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.location')}</Typography>
        <Location gap={0.5}>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            { isEditing ?
              <CoordsFieldEditable
                size='small'
                label=''
                variant='outlined'
                key='latitude'
                error={!isLatitudeValid}
                onChange={(e) => handleCoordinatesChange(e,1)}
                value={point.geometry.coordinates[1]}
              /> : <CoordsFieldNoEditable
                key='latitude'
                inputProps={{ readOnly: true }}
                defaultValue={point.geometry.coordinates[1]}
              />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            { isEditing ?
              <CoordsFieldEditable size='small' label='' variant='outlined' key='longitude'
                error={!isLongitudeValid}
                onChange={(e) => handleCoordinatesChange(e,0)}
                value={point.geometry.coordinates[0]}
              /> : <CoordsFieldNoEditable key='longitude'
                inputProps={{readOnly: true}}
                defaultValue={point.geometry.coordinates[0]}
              />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.longitude')}</Typography>
          </Stack>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            { isEditing ?
              <CoordsFieldEditable
                size='small'
                label=''
                variant='outlined'
                key='height'
                onChange={(e) => handleCoordinatesChange(e,2)}
                value={point.geometry.coordinates[2]}
              />
              : <CoordsFieldNoEditable key='height'
                inputProps={{ readOnly: true }}
                defaultValue={point.geometry.coordinates[2] ? point.geometry.coordinates[2] : '-'}
              />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.height')}</Typography>
          </Stack>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            <IconButton size='small' onClick={() => onAddPrecisePosition()} sx={precisePositionIconSx}>
              <EditLocationAltIcon sx={{color: isEditing? 'grey.600' : 'transparent'}}/>
            </IconButton>
          </Stack>
        </Location>
      </Stack>
      <DateInput isEditing={isEditing} onChange={handleDateChange} timestamp={point.properties.timestamp} sx={sxInput}/>
      <TextAreaInput isEditing={isEditing} onChange={handleDescriptionChange} text={point.properties.description} sx={sxInput}/>
      {!IS_WEB && <ImageInput isEditing={isEditing} images={images} sx={sxInput}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
        onDownloadImage={onDownloadImage}
      />}
    </ScrollableContent>
    { isEditing &&
      <Stack direction="row" justifyContent="center" gap={1} sx={{px: 1, pb: 2}}>
        <CancelButton isAccessibleSize={false} onCancel={handleCancel}/>
        <AcceptButton isAccessibleSize={false} disabled={!isFormValid} onAccept={handleAccept}/>
      </Stack>
    }
  </>;
};

export default PointPanel;
