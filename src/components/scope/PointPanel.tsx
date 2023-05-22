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
import {HEXColor, Scope, ImagePath, ScopePoint, UUID} from '../../types/commonTypes';
import styled from '@mui/material/styles/styled';

import FeaturesSummary from './FeaturesSummary';

import {DEFAULT_MAX_ZOOM, IS_WEB} from '../../config';
import useImages from '../../hooks/useImages';
import {openPhoto} from '../../utils/camera';
import useEditingPosition from '../../hooks/singleton/useEditingPosition';
import {Position} from 'geojson';
import useViewport from '../../hooks/singleton/useViewport';

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

const ScrollableContent = styled(Box)({
  overflow: 'auto',
  padding: '0px',
  marginBottom: '32px'
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
    point: ScopePoint,
    numPoints: number,
    numTracks: number,
    isEditing: boolean,
    onEditing: (isEditing: boolean) => void,
    onBackButtonClick: () => void,
    onPointChange: (newPoint: ScopePoint) => void,
    onGoTo: (pointId: UUID) => void
};

const PointPanel: FC<PointPanelProps> = ({
  scope,
  point,
  numPoints,
  numTracks,
  isEditing,
  onEditing,
  onBackButtonClick,
  onPointChange,
  onGoTo
}) => {
  const {t} = useTranslation();
  const {viewport, setViewport} = useViewport();
  const [uneditedPoint, setUneditedPoint] = useState<ScopePoint>();
  const {images, create, remove, save, discard} = useImages(point.properties.images);
  const editingPosition = useEditingPosition();
  const [acceptPoint, setAcceptPoint] = useState(false);

  const precisePositionIconSx = useMemo(() => ({
    '&:hover': {
      bgcolor: !isEditing ? 'common.white' : undefined,
      cursor: !isEditing ? 'default' : undefined
    }
  }), [isEditing]);

  useEffect(() => {
    if (isEditing) {
      setUneditedPoint(point);
    }
  }, [isEditing]);

  // VALIDATORS
  const [lon, lat] = point.geometry.coordinates;
  const isNameValid = point.properties.name.length > 0;
  const isLongitudeValid = lon >= -180 && lon <= 180;
  const isLatitudeValid = lat >= -90 && lat <= 90;
  const isFormValid = isNameValid && isLatitudeValid && isLongitudeValid;


  // HANDLERS
  const handleActionClick = useCallback((pointId: string, actionId: string) => {
    actionId === 'rename' ? onEditing(true) : onGoTo(pointId);
  }, []);
  
  const handleColorChange = useCallback((pointId: UUID, color: HEXColor) =>
    onPointChange({
      ...point,
      properties: {
        ...point.properties,
        color: color
      }
    }), [point]);

  const handleNameChange = useCallback((pointId: UUID, name: string) =>
    onPointChange({
      ...point,
      properties: {
        ...point.properties,
        name: name
      }
    }), [point]);

  const handleDateChange = useCallback((value: number) =>
    value && onPointChange({
      ...point,
      properties: {
        ...point.properties,
        timestamp: value // timestamp in milliseconds
      }
    }), [point]);

  const handleDescriptionChange = useCallback((value: string) =>
    onPointChange({
      ...point,
      properties: {
        ...point.properties,
        description: value
      }
    }), [point]);

  const handleCoordinatesChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, coordIndex: number) => {
    const newCoords = [...point.geometry.coordinates];
    (e.target.value === '' || e.target.value === '-') ?
      coordIndex === 2 ? newCoords.pop() : 0
      : newCoords[coordIndex] = parseFloat(e.target.value);

    onPointChange({
      ...point,
      geometry: {
        type: 'Point',
        coordinates: newCoords
      }
    });
  }, [point]);

  const setPosition = useCallback((newPosition?: Position) =>
    newPosition && onPointChange({
      ...point,
      geometry: {
        type: 'Point',
        coordinates: point.geometry.coordinates.length > 2 ? [...newPosition, point.geometry.coordinates[2]] : newPosition
      }
    }),
  [point]);

  const handleAddImage = () => create();

  const handleDeleteImage = (image: ImagePath) => remove(image);

  const handleOpenImage = (image: ImagePath) => openPhoto(images, image);

  const stopEditing = () => {
    editingPosition.cancel();
    onEditing(false);
  };

  const handleAccept = () => {
    save();
    onPointChange({
      ...point,
      properties: {
        ...point.properties,
        images
      }
    });
    stopEditing();
  };

  const handleCancel = () => {
    discard();
    uneditedPoint && onPointChange(uneditedPoint);
    stopEditing();
  };

  useEffect(() => {
    if (acceptPoint) {
      const newPosition = [viewport.longitude, viewport.latitude];
      setPosition(newPosition);
    }
    setAcceptPoint(false);
  }, [acceptPoint]);

  const startEditingPosition = () => {
    const position = point.geometry.coordinates;
    setViewport({longitude: position[0], latitude: position[1], zoom: DEFAULT_MAX_ZOOM});
    editingPosition.start({
      initialPosition: position,
      onAccept: () => setAcceptPoint(true),
      onCancel: setPosition
    });
  };

  return <>
    <Header
      startIcon={isEditing ? <></> : <ArrowBackIcon sx={{transform: 'rotate(180deg)'}}/>}
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
        isVisible={point.properties.isVisible}
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
                value={parseFloat(point.geometry.coordinates[1].toFixed(5))}
              /> : <CoordsFieldNoEditable
                key='latitude'
                inputProps={{ readOnly: true }}
                defaultValue={parseFloat(point.geometry.coordinates[1].toFixed(5))}
              />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            { isEditing ?
              <CoordsFieldEditable size='small' label='' variant='outlined' key='longitude'
                error={!isLongitudeValid}
                onChange={(e) => handleCoordinatesChange(e,0)}
                value={parseFloat(point.geometry.coordinates[0].toFixed(5))}
              /> : <CoordsFieldNoEditable key='longitude'
                inputProps={{readOnly: true}}
                defaultValue={parseFloat(point.geometry.coordinates[0].toFixed(5))}
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
            <IconButton size='small' onClick={startEditingPosition} sx={precisePositionIconSx}>
              <EditLocationAltIcon sx={{color: isEditing? 'grey.600' : 'transparent'}}/>
            </IconButton>
          </Stack>
        </Location>
      </Stack>
      <DateInput isEditing={isEditing} onChange={handleDateChange} timestamp={point.properties.timestamp} sx={sxInput}/>
      <TextAreaInput isEditing={isEditing} onChange={handleDescriptionChange} text={point.properties.description} sx={sxInput}/>
      {!IS_WEB && <ImageInput isEditing={isEditing}
        images={images}
        sx={sxInput}
        onAddImage={handleAddImage}
        onDeleteImage={handleDeleteImage}
        onDownloadImage={handleOpenImage}
      />}
    </ScrollableContent>
    { isEditing &&
      <Stack direction="row" justifyContent="center" gap={1} sx={{px: 1, pb: 2}}>
        <CancelButton onCancel={handleCancel}/>
        <AcceptButton disabled={!isFormValid} onAccept={handleAccept}/>
      </Stack>
    }
  </>;
};

export default React.memo(PointPanel);
