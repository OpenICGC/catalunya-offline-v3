import React, {FC, ReactNode, useState} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
import ColorSwitch from '@geomatico/geocomponents/ColorSwitch';
import ColorRampLegend from '@geomatico/geocomponents/ColorRampLegend';

//UTILS
import {primaryColor} from '../../theme';
import styled from '@mui/system/styled';
import {ColorFormat, ColorPicker, ColorInput, ColorInputProps, ColorBox, ColorPalette, ColorButton} from 'material-ui-color';
import {useTranslation} from 'react-i18next';
import {HEXColor, UUID} from '../../types/commonTypes';
import {COLOR_PALETTES, DEFAULT_TRACK_TOLERANCE, GPS_POSITION_COLOR} from '../../config';
import InputNumber from './InputNumber';
import LocationMarkerIcon from '../map/LocationMarkerIcon';
import IconButton from '@mui/material/IconButton';
import AddTrack from '../icons/AddTrack';
import AddButton from '../buttons/AddButton';
import FabButton from '../buttons/FabButton';
import Box from '@mui/material/Box';
import {FormControl, InputLabel, Select, SelectChangeEvent} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import useTheme from '@mui/material/styles/useTheme';
import Divider from '@mui/material/Divider';

//STYLES
const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

const SettingGroup = styled(Stack)(({theme}) => {
  return {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    '&:nth-child(8)': {
      paddingLeft: '8px',
      paddingRight: '0px',
    }
  };
});

const languages = [
  {
    id: 'ca',
    content: <Typography variant='caption'>CA</Typography>
  },
  {
    id: 'es',
    content: <Typography variant='caption'>ES</Typography>
  },
  {
    id: 'en',
    content: <Typography variant='caption'>EN</Typography>
  }
];



//TYPES
export type SettingsProps = {
  isLeftHanded: boolean,
  positionColor: HEXColor,
  trackTolerance: number,
  selectedLanguageId: string,
  selectedSizeId: string,
  selectedPaletteIndex: number,
  onColorChange: (color: HEXColor) => void,
  onLanguageClick: (optionId: string) => void,
  onLeftHandedChange: () => void,
  onPaletteChange: (palette: string) => void,
  onSizeChange: (size: string) => void,
  onToleranceChange: (tolerance: number) => void,
};

const inputFormats: ColorFormat[] = [];

const Settings: FC<SettingsProps> = ({
  positionColor= GPS_POSITION_COLOR,
  selectedPaletteIndex= 0,
  isLeftHanded= false,
  trackTolerance= 40,
  selectedLanguageId,
  selectedSizeId= 'small',
  onColorChange,
  onPaletteChange,
  onLeftHandedChange,
  onToleranceChange,
  onLanguageClick,
  onSizeChange
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const handleColorChange = (color: {hex: string}) => onColorChange(`#${color.hex}`);
  const handlePaletteChange = (e: SelectChangeEvent) => onPaletteChange(e.target.value);
  const handleSizeChange = (size: string) => onSizeChange(size);



  return <Dialog open={true} fullWidth PaperProps={{sx: {height: 'auto'}}}>
    <DialogTitle sx={dialogSx}>
      <SettingsIcon sx={{mr: 2}}/>
      {t('settings.title')}
    </DialogTitle>
    <DialogContent sx={{mt: 2, py: 2, px: 1}}>
      <Typography variant='caption' sx={{p: 2, fontWeight: 900}}>{t('settings.navigation').toUpperCase()}</Typography>
      <SettingGroup>
        <Typography>{t('settings.positionColor')}</Typography>
        <ColorPicker
          hideTextfield
          disableAlpha
          value={positionColor}
          inputFormats={inputFormats}
          onChange={handleColorChange}
          palette={COLOR_PALETTES[selectedPaletteIndex]}
        />
      </SettingGroup>
      <SettingGroup>
        <Typography>{t('settings.trackTolerance')}</Typography>
        <InputNumber onChange={onToleranceChange} value={trackTolerance}/>
      </SettingGroup>
      <Divider sx={{my: 1}}/>
      <Typography variant='caption' sx={{p: 2, fontWeight: 900}}>{t('settings.accessibility').toUpperCase()}</Typography>
      <SettingGroup>
        <Typography>{t('settings.leftHanded')}</Typography>
        <ColorSwitch color={primaryColor} checked={isLeftHanded} onChange={onLeftHandedChange}/>
      </SettingGroup>
      <SettingGroup>
        <Typography>{t('settings.buttonSize')}</Typography>
        <Box>
          <AddButton 
            isLeftHanded={false} 
            isAccessibleSize={true} 
            onClick={() => handleSizeChange('large')}
            sx={{
              bottom: 0, 
              m:0, 
              border: selectedSizeId === 'large'? `4px solid ${theme.palette.primary.main}`: 0
            }}
          ><AddTrack/>
          </AddButton>
          <AddButton 
            isLeftHanded={false} 
            isAccessibleSize={false} 
            onClick={() => handleSizeChange('small')}
            sx={{
              bottom: 0,
              border: selectedSizeId === 'small'? `4px solid ${theme.palette.primary.main}`: 0
            }}>
            <AddTrack/>
          </AddButton>
        </Box>
      </SettingGroup>
      <SettingGroup>
        <Stack p={0}>
          <Typography sx={{px:1}}>{t('settings.defaultPalette')}</Typography>
          <FormControl variant='standard' fullWidth>
            <Select
              value={selectedPaletteIndex.toString()}
              label="Palette"
              disableUnderline
              onChange={handlePaletteChange}
              sx={{px: 0}}
            >
              {
                COLOR_PALETTES && COLOR_PALETTES.map((palette, index) => <MenuItem 
                  key={index} 
                  value={index}>
                  <ColorPalette palette={palette}/>
                </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Stack>
      </SettingGroup>
      <Divider sx={{my: 1}}/>
      <Typography variant='caption' sx={{p: 2, fontWeight: 900}}>{t('settings.language').toUpperCase()}</Typography>
      <SettingGroup>
        <Typography>{t('settings.language')}</Typography>
        <ButtonGroup
          selectedItemId={selectedLanguageId}
          items={languages}
          onItemClick={onLanguageClick}
          color={primaryColor}
          variant='outlined'
        />
      </SettingGroup>
    </DialogContent>
  </Dialog>;
};
export default Settings;