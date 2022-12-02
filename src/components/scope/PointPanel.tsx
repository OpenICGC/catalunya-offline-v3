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
import {HEXColor, Scope, ScopeImage, ScopePoint, UUID} from '../../types/commonTypes';
import styled from '@mui/styles/styled';
import i18n from 'i18next';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import moment, {Moment} from 'moment';
import {Theme} from '@mui/material';

//STYLES
const sectionTitleSx = {
  color: 'grey.600',
};

const SectionContent = styled(Stack)({
  padding: '8px',
  marginBottom: '0px',
});

const coordTitle = {
  color: 'grey.500'
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
    /*outline: '1px solid green',*/
    '& .MuiInputBase-input': { //text
      padding: '4px',
      fontSize: '0.875rem',
      minWidth: '25px',
      cursor: 'default',
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

const textAreaCommon = {
  cursor: 'default',
  padding: '8px',
  fontFamily: '\'Roboto\',\'Helvetica\',\'Arial\'',
  fontSize: '1rem',
  letterSpacing: '0.00938em',
  fontWeight: 400,
  lineHeight: 1.5,
  border: '0px solid white',
  borderRadius: '4px',
};
const TextAreaEditable = styled(TextareaAutosize)({
  ...textAreaCommon,
  resize: 'none',
  outline: '1px solid rgba(0,0,0,0.23)',
  '&:focus': {
    outline: '2px solid orange',
  }
});
const TextAreaNoEditable = styled(TextareaAutosize)({
  ...textAreaCommon,
  resize: 'none',
  '&:focus': {
    outline: 'none'
  }
});

const Location = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
});

export type PointPanelProps = {
    scope: Scope,
    point: ScopePoint,
    numPoints: number,
    numPaths: number,
    images: Array<ScopeImage>,
    isLoading?: boolean,
    onBackButtonClick: () => void,
    onPointChange: (point: ScopePoint) => void,
    onActionClick: (itemId: UUID, actionId: string) => void,
    onGoTo: (itemId: UUID) => void,
    onRename: (itemId: UUID) => void,
    onAddImage: () => void,
    onDeleteImage: (imageId: UUID) => void,
    onDownloadImage: (imageId: UUID, content_type: string) => void,
    onAddPrecisePosition: () => void,
    isAccessibleSize?: boolean,
    isLeftHanded?: boolean,
};

const PointPanel: FC<PointPanelProps> = ({
  /*isAccessibleSize,
                                             isLeftHanded,*/
  scope,
  point,
  numPoints,
  numPaths,
  images,
  onBackButtonClick,
  onPointChange,
  onActionClick,
  onGoTo,
  onRename,
  onAddImage,
  onDeleteImage,
  onDownloadImage,
  onAddPrecisePosition
        
}) => {
  
  const actionIcons = [
    {
      id: 'rename',
      activeIcon: <EditIcon/>,
      callbackProp: onRename
    },
    {
      id: 'goTo',
      activeIcon: <SwipeRightAltIcon/>,
      callbackProp: onGoTo
    }
  ];

  const {t} = useTranslation();
  
  //EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [pointToUpdate, setPointToUpdate] = useState(point);

  const item = {
    id: point.id,
    name: point.properties.name,
    color: point.properties.color || scope.color,
    isActive: point.properties.isVisible,
    isEditing: isEditing
  };
  
  const handleActionClick = (itemId: string, actionId: string) => {
    actionId === 'rename' ? setIsEditing(true) : onActionClick(itemId, actionId);
  };
  
  const handleColorChange = (color: HEXColor) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      color: color
    }
  });

  const handleNameChange = (name: string) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      name: name
    }
  });

  const handleDateChange = (value: Moment | null, keyboardInputValue?: string) => console.log(value, keyboardInputValue);
  
  const handleDateAccept = (value: Moment | null) => value && setPointToUpdate(({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      timestamp: value.unix()
    }
  }));


  const handleDescriptionChange = (value: ChangeEvent<HTMLTextAreaElement>) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      description: value.target.value
    }
  });

  const handleCoordinatesChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, coordIndex: number) => {
    const newCoords = [...pointToUpdate.geometry.coordinates];
    newCoords[coordIndex] = parseInt(e.target.value);
    return newCoords;
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
    <ListItem 
      item={item}
      isEditing={isEditing}
      actionIcons={actionIcons}
      onActionClick={handleActionClick}
      onClick={() => console.log('click')}
      onColorChange={handleColorChange}
      onNameChange={handleNameChange}
    />
    <Stack>
      <SectionContent id='location'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.location')}</Typography>
        <Location gap={0.5} >
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined'
                  inputRef={input => input && input.focus()}
                  onChange={(e) => handleCoordinatesChange(e,0)}
                  defaultValue={point.geometry.coordinates[0]}
                />
                : <CoordsFieldNoEditable
                  inputProps={{ readOnly: true }}
                  defaultValue={point.geometry.coordinates[0]}
                />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined'
                  /*onChange={handleCoordinatesChange(1)}*/
                  defaultValue={point.geometry.coordinates[1]}
                />
                : <CoordsFieldNoEditable
                  inputProps={{readOnly: true}}
                  defaultValue={point.geometry.coordinates[1]}
                />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.longitude')}</Typography>
          </Stack>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            {
              isEditing ?
                <CoordsFieldEditable size='small' label='' variant='outlined'
                  defaultValue={point.geometry.coordinates[2]}
                />
                : <CoordsFieldNoEditable
                  inputProps={{ readOnly: true }}
                  defaultValue={point.geometry.coordinates[2]}
                />
            }
            <Typography sx={coordTitle} variant='caption'>{t('properties.height')}</Typography>
          </Stack>
          <Stack alignItems='center' sx={{m: 0, p: 0}}>
            {
              isEditing ? <IconButton size='small' onClick={() => onAddPrecisePosition()}>
                <EditLocationAltIcon sx={{color: 'grey.600'}}/>
              </IconButton> : 
                <IconButton size='small' disabled disableRipple>
                  <EditLocationAltIcon  sx={{color: 'transparent'}}/>
                </IconButton>
            }
          </Stack>
        </Location>
      </SectionContent>
      <SectionContent id='date'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.date')}</Typography>
        {
          isEditing ? <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
            <DateTimePicker
              onChange={handleDateChange}
              onAccept={handleDateAccept}
              value={pointToUpdate.properties.timestamp || moment()}
              renderInput={(params) => <DateTimeFieldEditable {...params} size="small" />}/>
          </LocalizationProvider> : <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
            <DateTimePicker
              readOnly
              onChange={handleDateChange}
              onAccept={handleDateAccept}
              value={moment(pointToUpdate.properties.timestamp, 'x')}
              renderInput={(params) => <DateTimeFieldNoEditable {...params} />}/>
          </LocalizationProvider>
        }
      </SectionContent>
      <SectionContent id='description'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.description')}</Typography>
        {
          isEditing ?
            <TextAreaEditable
              defaultValue={point.properties.description || ''}
              minRows={3}
              onChange={handleDescriptionChange}
            /> :
            <TextAreaNoEditable
              defaultValue={point.properties.description || ''}
              minRows={3}
              readOnly
            />
        }
      </SectionContent>
      <SectionContent id='images'>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.images')}</Typography>
        <Stack direction='row' flexWrap='wrap'>
          {
            images.map(image => <Thumbnail key={image.id} image={image} onDelete={onDeleteImage} onDownloadImage={onDownloadImage} isDeletable={isEditing}/>)
          }
          {isEditing && <AddImageButton onAddImage={onAddImage}/>}
        </Stack>
      </SectionContent>
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
    </Stack>
  </>;
};

export default PointPanel;