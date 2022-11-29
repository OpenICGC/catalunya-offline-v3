import React, {ChangeEvent, FC} from 'react';

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


//STYLES
const sectionTitleSx = {
  color: 'grey.600',
};

const coordinatesInputSx = {
  flexGrow: 1,
  '& .MuiInputBase-input': {
    px: 1,
    fontSize: '0.875rem',
    minWidth: '50px'
  }
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
  const handleLatitudeChange = (e: ChangeEvent<HTMLInputElement>) => console.log(e.target.value);
  /*const handleBlur = () => setIsEditing(false);*/
  /*const handleInputOut = (e: KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter') {
      setIsEditing(false);
    }
  };*/
  
  return <>
    <Header
      name={scope.name}
      color={scope.color}
      numPoints={numPoints}
      numPaths={numPaths}
      onBackButtonClick={onBackButtonClick}
    />
    <Stack sx={{p: 1}}>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant='caption' gutterBottom>{t('properties.location')}</Typography>
        <Typography>{isEditing}</Typography>
        <Stack direction='row' justifyContent='space-between' mx={1} sx={{gap: 1}}>
          <Stack alignItems='center'>
            {
              isEditing ?
                <TextField size='small' label='' variant='outlined' sx={coordinatesInputSx}
                  inputRef={input => input && input.focus()}
                  onChange={handleLatitudeChange}
                  /*onBlur={handleBlur} */
                  /*onKeyDown={handleInputOut}*/
                  defaultValue={point.geometry.coordinates[0]}
                />
                : <Typography variant='body2' sx={{px: 1, py: '8.5px', minWidth: '50px'}}>{point.geometry.coordinates[0]}</Typography>
            }
            <Typography variant='caption'>{t('properties.latitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            {
              isEditing ?
                <TextField size='small' label='' variant='outlined' sx={coordinatesInputSx}
                  inputRef={input => input && input.focus()}
                  onChange={handleLatitudeChange}
                  /*onBlur={handleBlur} */
                  /*onKeyDown={handleInputOut}*/
                  defaultValue={point.geometry.coordinates[1]}
                />
                : <Typography variant='body2' sx={{px: 1, py: '8.5px', minWidth: '50px'}}>{point.geometry.coordinates[1]}</Typography>
            }
            <Typography variant='caption'>{t('properties.longitude')}</Typography>
          </Stack>
          <Stack alignItems='center'>
            {
              isEditing ?
                <TextField size='small' label='' variant='outlined' sx={coordinatesInputSx}
                  inputRef={input => input && input.focus()}
                  onChange={handleLatitudeChange}
                  /*onBlur={handleBlur} */
                  /*onKeyDown={handleInputOut}*/
                  defaultValue={point.geometry.coordinates[2]}
                />
                : <Typography sx={{px: 1, py: '8.5px', minWidth: '50px'}} variant='body2'>{point.geometry.coordinates[2]}</Typography>
            }
            <Typography variant='caption'>{t('properties.height')}</Typography>
          </Stack>
        </Stack>
      </SectionContent>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.date')}</Typography>
      </SectionContent>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.description')}</Typography>
      </SectionContent>
      <SectionContent>
        <Typography sx={sectionTitleSx} variant='caption'>{t('properties.images')}</Typography>
      </SectionContent>
    </Stack>
  </>;
};

export default PointPanel;

