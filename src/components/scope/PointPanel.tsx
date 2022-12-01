import React, {ChangeEvent, FC, useState} from 'react';

//MUI
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import Button from '@mui/material/Button';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import Typography from '@mui/material/Typography';
import {LocalizationProvider} from '@mui/x-date-pickers';

//MUI-ICONS
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';

//CATOFFLINE
import AddImageButton from '../buttons/AddImageButton';
import Header from './Header';
import ListItem from './ListItem';
import Thumbnail from '../common/Thumbnail';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor, Scope, ScopePoint, UUID} from '../../types/commonTypes';
import styled from '@mui/styles/styled';
import i18n from 'i18next';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import moment, {Moment} from 'moment';
import {Theme} from '@mui/material';
import Box from '@mui/material/Box';

//STYLES
const sectionTitleSx = {
  color: 'grey.600',
};

const coordTitle = {
  color: 'grey.500'
};

export type PointPanelProps = {
    scope: Scope,
    point: ScopePoint,
    numPoints: number,
    numPaths: number,
    isLoading?: boolean,
    onBackButtonClick: () => void,
    onPointChange: (point: ScopePoint) => void,
    onGoTo: (itemId: UUID) => void,
    onAddImage: () => void,
    onDeleteImage: (imageId: UUID) => void,
    onDownloadImage: (imageId: UUID, content_type: string) => void,
    onAddPrecisePosition: () => void,
};

const PointPanel: FC<PointPanelProps> = ({
  scope,
  point,
  numPoints,
  numPaths,
  onBackButtonClick,
  onPointChange,
  onGoTo,
  onAddImage,
  onDeleteImage,
  onDownloadImage,
  onAddPrecisePosition
        
}) => {
  //EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [pointToUpdate, setPointToUpdate] = useState(point);
    
  //STYLES
  const SectionContent = styled(Stack)({
    padding: '8px',
    marginBottom: '0px',
  });
  
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
  
  const DateTimeFieldEditable = styled(TextField)({
    flexGrow: 1,
    fontSize: '0.875rem',
    '& .MuiInputBase-input': {
      outline: '0px solid white',
      padding: '4px',
      fontSize: '0.875rem',
      minWidth: '30px'
    },
    '& .MuiButtonBase-root': {
      paddingRight: '2px'
    }
  });
  
  const DateTimeFieldNoEditable = styled(TextField)<Theme>(({theme}) => {
    return {
      borderRadius: '4px',
      flexGrow: 1,
      fontSize: '0.875rem',
      '& .MuiInputBase-input': { //text
        padding: '4px',
        fontSize: '0.875rem',
        minWidth: '25px',
        cursor: 'default',
      },
      '&:hover': {
        borderColor: 'transparent',
      },
      '& fieldset.MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
      '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
        borderColor: 'transparent',
      },
      '& fieldset.MuiOutlinedInput-notchedOutline:hover': {
        borderColor: 'transparent',
      },
      '& .MuiButtonBase-root': { //icon
        paddingRight: '2px',
        color: theme.palette.action.active
      }
    };
  });
  
  const TextAreaEditable = styled(TextareaAutosize)({
    cursor: 'default',
    padding: '8px',
    fontFamily: '\'Roboto\',\'Helvetica\',\'Arial\'',
    fontSize: '1rem',
    letterSpacing: '0.00938em',
    fontWeight: 400,
    lineHeight: 1.5,
    border: '0px solid white',
    borderRadius: '4px',
    resize: 'none',
    outline: isEditing ? '1px solid rgba(0,0,0,0.23)' : 'none',
    '&:focus': {
      outline: isEditing ? '2px solid orange' : 'none',
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

  const {t} = useTranslation();

  const ScrollableContent = styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isEditing ? '32px' : '16px',
  });

  const precisePositionIconSx = {
    '&:hover': {
      bgcolor: !isEditing ? 'common.white' : undefined,
      cursor: !isEditing ? 'default' : undefined
    }
  };
  
  const handleActionClick = (itemId: string, actionId: string) => {
    actionId === 'rename' ? setIsEditing(true) : onGoTo(itemId);
  };
  
  const handleColorChange = (color: HEXColor) => {
    pointToUpdate.properties.color && setPointToUpdate({
      ...pointToUpdate,
      properties: {
        ...pointToUpdate.properties,
        color: color
      }
    });
  };

  const handleNameChange = (name: string) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      name: name
    }
  });

  const handleDateChange = (value: Moment | null) => {
    value && setPointToUpdate(({
      ...pointToUpdate,
      properties: {
        ...pointToUpdate.properties,
        timestamp: value.toDate().getTime()
      }
    }));
  };

  const handleDescriptionChange = (value: ChangeEvent<HTMLTextAreaElement>) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      description: value.target.value
    }
  });

  const handleCoordinatesChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, coordIndex: number) => {
    const newCoords = [...pointToUpdate.geometry.coordinates];
    (e.target.value === '' || e.target.value === '-') ?
      coordIndex === 2 ? newCoords.pop() : 0
      : newCoords[coordIndex] = parseFloat(e.target.value);
    setPointToUpdate({
      ...pointToUpdate,
      geometry: {
        type: 'Point',
        coordinates: newCoords
      }});
  };
  
  const handleCancel = () => {
    setPointToUpdate(point);
    setIsEditing(false);
  };
  const handleAccept = () => {
    onPointChange(pointToUpdate);
    setIsEditing(false);
  };

  return <>
    <Header
      name={scope.name}
      color={scope.color}
      numPoints={numPoints}
      numPaths={numPaths}
      onBackButtonClick={() => onBackButtonClick()}
    />
    <Box>{/*makes up&down margin*/}
      <ListItem
        itemId={point.id}
        name={point.properties.name}
        color={point.properties.color || scope.color}
        isActive={point.properties.isVisible}
        isEditing={isEditing}
        actionIcons={actionIcons}
        onActionClick={handleActionClick}
        onClick={() => console.log('click')}
        onColorChange={handleColorChange}
        onNameChange={handleNameChange}
      />
    </Box>
    <ScrollableContent>
      <SectionContent id='location'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.location')}</Typography>
        <Location gap={0.5} >
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined' key='latitude'
                  error={
                    typeof(pointToUpdate.geometry.coordinates[0]) !== 'number' || 
                          pointToUpdate.geometry.coordinates[0] > 90 || 
                          pointToUpdate.geometry.coordinates[0] < -90
                  }
                  onChange={(e) => handleCoordinatesChange(e,0)}
                  defaultValue={pointToUpdate.geometry.coordinates[0]}
                />
                : <CoordsFieldNoEditable key='latitude'
                  inputProps={{ readOnly: true }}
                  defaultValue={pointToUpdate.geometry.coordinates[0]}
                />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined' key='longitude'
                  error={
                    typeof(pointToUpdate.geometry.coordinates[1]) !== 'number' || 
                          pointToUpdate.geometry.coordinates[1] > 180 || 
                          pointToUpdate.geometry.coordinates[1] < -180
                  }
                  onChange={(e) => handleCoordinatesChange(e,1)}
                  defaultValue={pointToUpdate.geometry.coordinates[1]}
                />
                : <CoordsFieldNoEditable key='longitude'
                  inputProps={{readOnly: true}}
                  defaultValue={pointToUpdate.geometry.coordinates[1]}
                />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.longitude')}</Typography>
          </Stack>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined' key='height'
                  error={typeof(pointToUpdate.geometry.coordinates[2]) !== 'number'}
                  onChange={(e) => handleCoordinatesChange(e,2)}
                  defaultValue={pointToUpdate.geometry.coordinates[2]}
                />
                : <CoordsFieldNoEditable key='height'
                  inputProps={{ readOnly: true }}
                  defaultValue={pointToUpdate.geometry.coordinates[2] ? pointToUpdate.geometry.coordinates[2] : '-'}
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
      </SectionContent>
      <SectionContent id='date'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.date')}</Typography>
        <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
          <DateTimePicker
            key='dateTime'
            readOnly={!isEditing}
            onChange={handleDateChange}
            value={moment(pointToUpdate.properties.timestamp, 'x')}
            renderInput={(params) => isEditing ? <DateTimeFieldEditable {...params} size="small" /> : <DateTimeFieldNoEditable {...params} />}/>
        </LocalizationProvider>
      </SectionContent>
      <SectionContent id='description'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.description')}</Typography>
        <TextAreaEditable
          key='description'
          readOnly={!isEditing}
          defaultValue={pointToUpdate.properties.description || ''}
          minRows={3}
          onChange={handleDescriptionChange}
        />
      </SectionContent>
      <SectionContent id='images'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.images')}</Typography>
        <Stack direction='row' flexWrap='wrap'>
          {
            pointToUpdate.properties.images.map(image =>
              <Thumbnail
                key={image.id}
                image={image}
                onDelete={onDeleteImage}
                onDownloadImage={onDownloadImage}
                isDeletable={isEditing}
              />)
          }
          {isEditing && <AddImageButton onAddImage={onAddImage}/>}
        </Stack>
      </SectionContent>
    </ScrollableContent>
    {
      isEditing && <Stack direction="row" justifyContent="center">
        <Button startIcon={<CancelIcon/>} color="error"
          onClick={handleCancel}>{t('actions.cancel')}</Button>
        <Button
          startIcon={<CheckCircleIcon/>}
          disabled={pointToUpdate.properties.name === '' || (pointToUpdate.geometry.coordinates[0] || pointToUpdate.geometry.coordinates[1]) === undefined}
          color="success"
          onClick={handleAccept}
        >{t('actions.accept')}</Button>
      </Stack>
    }
  </>;
};

export default PointPanel;