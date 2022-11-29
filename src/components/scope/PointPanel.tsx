import React, {ChangeEvent, FC, useState} from 'react';

//MUI-ICONS


//CATOFFLINE


//UTILS
import {useTranslation} from 'react-i18next';
import {Scope, ScopePoint} from '../../types/commonTypes';
import Header from './Header';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import TextField from '@mui/material/TextField';
import ListItemIcon from '@mui/material/ListItemIcon';
import {ColorPicker} from 'material-ui-color';
import ListItemText from '@mui/material/ListItemText';
import TextareaAutosize from '@mui/base/TextareaAutosize';


//STYLES
const sectionTitleSx = {
  color: 'grey.600'
};

export type PointPanelProps = {
    isEditing: boolean,
    scope: Scope,
    point: ScopePoint,
    numPoints: number,
    numPaths: number,

    onBackButtonClick: () => void,
    /*isAccessibleSize?: boolean,
    isLeftHanded?: boolean,*/
};

const SectionContent = styled(Stack)({
  margin: '8px 0'
});

const TextFieldEditable = styled(TextField)({
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    px: 1,
    fontSize: '0.875rem',
    minWidth: '50px'
  }
});

const TextFieldNoEditable = styled(TextField)({
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    px: 1,
    fontSize: '0.875rem',
    minWidth: '50px'
  }
});

const textAreaCommon = {
  padding: '10px',
  letterSpacing: '0.00938em',
  fontWeight: 400,
  lineHeight: 1.5,
  fontFamily: '\'Roboto\',\'Helvetica\',\'Arial\'',
  fontSize: '1rem',
  border: '0px solid white',
};

const TextAreaEditable = styled(TextareaAutosize)({
  ...textAreaCommon,
  outline: '2px solid orange',
  borderRadius: '4px',
  resize: 'none'
});

const TextAreaNoEditable = styled(TextareaAutosize)({
  ...textAreaCommon,
  cursor: 'default',
  borderRadius: '4px',
  resize: 'none',
  '&:focus': {
    outline: 'none'
  }
});

const Location = styled(Stack)({
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: '0px',
});

const PointPanel: FC<PointPanelProps> = ({
  /*isAccessibleSize,
                                             isLeftHanded,*/
  isEditing,
  scope,
  point,
  numPoints,
  numPaths,
  onBackButtonClick
}) => {
  const {t} = useTranslation();

  //EDIT
  /*const [isEditing, setIsEditing] = useState(true);*/
  const [pointToUpdate, setPointToUpdate] = useState(point);

  const handleColorChange = (color: { hex: string }) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      color: `#${color.hex}`
    }
  });
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      name: e.target.value
    }
  });
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => setPointToUpdate({
    ...pointToUpdate,
    properties: {
      ...pointToUpdate.properties,
      description: e.target.value
    }
  });
    /*const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => setPointToUpdate({
      ...pointToUpdate,
      geometry: {
        ...pointToUpdate.geometry,
        coordinates: [e.target.value, coordinates[1], coordinates[2]]
      }  
    });*/
    
  const handleCoordinatesChange = (e: ChangeEvent<HTMLInputElement>, coordIndex: number) => {
    const newCoords = [...pointToUpdate.geometry.coordinates];
    newCoords[coordIndex] = e.target.value;
    return newCoords;
  };
  const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => console.log(e);

  return <>
    <Header
      name={scope.name}
      color={scope.color}
      numPoints={numPoints}
      numPaths={numPaths}
      onBackButtonClick={onBackButtonClick}
    />
    <Stack sx={{p: 1}}>
      {/* <MuiListItem sx={{height: '48px', p: 0, m: 0}}>
      <ListItemIcon sx={{minWidth: '24px', p: 0}}>
        <ColorPicker
          hideTextfield
          disableAlpha
          value={point.properties.color}
          inputFormats={[]}
          onChange={handleColorChange}
        />
      </ListItemIcon>
      {
        isEditing ?
          <TextField size='small' label={t('properties.name')} variant='outlined' sx={{mr: 1, flexGrow: 1}}
            inputRef={input => input && input.focus()}
            onChange={handleNameChange}
            defaultValue={point.properties.name}
          />
          : <ListItemText primary={point.properties.name} sx={{mt: 1, ml: isEditing ? 1 : 'auto', cursor: 'pointer'}} onClick={() => onClick(item.id)}/>
      }*/}
      <SectionContent>
        <Typography sx={sectionTitleSx} variant="caption" gutterBottom>{t('properties.location')}</Typography>
        <Location>
          <Stack alignItems="center" sx={{m: 0, p: 0}}>
            {
              isEditing ?
                <TextFieldEditable size="small" label="" variant="outlined"
                  inputRef={input => input && input.focus()}
                  onChange={handleCoordinatesChange(e,0)}
                  defaultValue={point.geometry.coordinates[0]}
                />
                : <TextFieldNoEditable size="small" label="" variant="outlined"
                  inputProps={{ readOnly: true }}
                  defaultValue={point.geometry.coordinates[0]}
                />
            }
            <Typography variant="caption">{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems="center">
            {
              isEditing ?
                <TextField size="small" label="" variant="outlined"
                  /*inputRef={input => input && input.focus()}*/
                  onChange={handleCoordinatesChange(1)}
                  defaultValue={point.geometry.coordinates[1]}
                />
                : <TextField size="small" label="" variant="outlined"
                  inputProps={{ readOnly: true }}
                  defaultValue={point.geometry.coordinates[1]}
                />
            }
            <Typography variant="caption">{t('properties.longitude')}</Typography>
          </Stack>
          <Stack alignItems="center">
            {
              isEditing ?
                <TextField size="small" label="" variant="outlined"
                  /*inputRef={input => input && input.focus()}*/
                  onChange={handleCoordinatesChange(2)}
                  defaultValue={point.geometry.coordinates[2]}
                />
                : <TextField size="small" label="" variant="outlined"
                  inputProps={{ readOnly: true }}
                  defaultValue={point.geometry.coordinates[2]}
                />
            }
            <Typography variant="caption">{t('properties.height')}</Typography>
          </Stack>
        </Location>
      </SectionContent>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant="caption">{t('properties.date')}</Typography>
      </SectionContent>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant="caption">{t('properties.description')}</Typography>
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
      <SectionContent>
        <Typography sx={sectionTitleSx} variant="caption">{t('properties.images')}</Typography>
      </SectionContent>
    </Stack>
  </>;
};

export default PointPanel;

