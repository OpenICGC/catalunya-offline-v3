import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import SettingsIcon from '@mui/icons-material/Settings';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//GEOCOMPONENTS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
import ColorSwitch from '@geomatico/geocomponents/ColorSwitch';

import {ColorFormat, ColorPicker, ColorPalette} from 'material-ui-color';

//CATOFFLINE
import InputNumber from './InputNumber';
import AddTrack from '../icons/AddTrack';
import AddButton from '../buttons/AddButton';

//UTILS
import {primaryColor} from '../../theme';
import styled from '@mui/system/styled';
import {useTranslation} from 'react-i18next';
import {HEXColor, LANGUAGE} from '../../types/commonTypes';
import {COLOR_PALETTES} from '../../config';
import {SelectChangeEvent} from '@mui/material';
import useTheme from '@mui/material/styles/useTheme';

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
    '&#default-palette-form': {
      paddingLeft: '8px',
      paddingRight: '0px',
    }
  };
});

const inputFormats: ColorFormat[] = [];

const asColorPickerPalette = (name: string) => COLOR_PALETTES[name].reduce<Record<HEXColor, HEXColor>>(
  (obj, color) => ({
    ...obj,
    [color]: color
  }), {});

const languageOptions = [{
  id: LANGUAGE[LANGUAGE.ca],
  content: <Typography variant='caption'>CA</Typography>
}, {
  id: LANGUAGE[LANGUAGE.en],
  content: <Typography variant='caption'>EN</Typography>
}, {
  id: LANGUAGE[LANGUAGE.es],
  content: <Typography variant='caption'>ES</Typography>
}];

//TYPES
export type SettingsDialogProps = {
  gpsPositionColor: HEXColor,
  onGpsPositionColorChange: (gpsPositionColor: HEXColor) => void,
  trackTolerance: number,
  onTrackToleranceChange: (trackTolerance: number) => void,
  isLeftHanded: boolean,
  onLeftHandedChange: (isLeftHanded: boolean) => void,
  isAccessibleSize: boolean,
  onButtonSizeChange: (isAccessibleSize: boolean) => void,
  colorPalette: string
  onColorPaletteChange: (colorPalette: string) => void,
  language: LANGUAGE,
  onLanguageChange: (language: LANGUAGE) => void,
  onClose: () => void,
};

const SettingsDialog: FC<SettingsDialogProps> = ({
  gpsPositionColor,
  onGpsPositionColorChange,
  trackTolerance,
  onTrackToleranceChange,
  isLeftHanded,
  onLeftHandedChange,
  isAccessibleSize,
  onButtonSizeChange,
  colorPalette,
  onColorPaletteChange,
  language,
  onLanguageChange,
  onClose
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const handleGpsPositionColorChange = (e: {hex: string}) => onGpsPositionColorChange(`#${e.hex}`);
  const handlePaletteChange = (e: SelectChangeEvent) => onColorPaletteChange(e.target.value);

  const handleLanguageChange = (lang: LANGUAGE | null) => lang !== null && onLanguageChange(lang);
  const handleClose = () => onClose();

  return <Dialog open={true} fullWidth PaperProps={{sx: {height: 'auto'}}} onClose={handleClose}>
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
          value={gpsPositionColor}
          inputFormats={inputFormats}
          onChange={handleGpsPositionColorChange}
          palette={asColorPickerPalette(colorPalette)}
        />
      </SettingGroup>
      <SettingGroup>
        <Typography>{t('settings.trackTolerance')}</Typography>
        <InputNumber onChange={onTrackToleranceChange} value={trackTolerance}/>
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
            onClick={() => onButtonSizeChange(isAccessibleSize)}
            sx={{
              bottom: 0, 
              m:0, 
              border: isAccessibleSize ? `4px solid ${theme.palette.primary.main}`: 0
            }}
          ><AddTrack/>
          </AddButton>
          <AddButton 
            isLeftHanded={false} 
            isAccessibleSize={false} 
            onClick={() => onButtonSizeChange(!isAccessibleSize)}
            sx={{
              bottom: 0,
              border: !isAccessibleSize ? `4px solid ${theme.palette.primary.main}`: 0
            }}>
            <AddTrack/>
          </AddButton>
        </Box>
      </SettingGroup>
      <SettingGroup id='default-palette-form'>
        <Stack p={0}>
          <Typography sx={{px:1}}>{t('settings.defaultPalette')}</Typography>
          <FormControl variant='standard' fullWidth>
            <Select
              value={colorPalette}
              label="Palette"
              disableUnderline
              onChange={handlePaletteChange}
              sx={{px: 0}}
            >
              {
                Object.keys(COLOR_PALETTES).map((paletteName) =>
                  <MenuItem
                    key={paletteName}
                    value={paletteName}>
                    <ColorPalette palette={asColorPickerPalette(paletteName)}/>
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
          selectedItemId={LANGUAGE[language]}
          items={languageOptions}
          onItemClick={handleLanguageChange}
          color={primaryColor}
          variant='outlined'
        />
      </SettingGroup>
    </DialogContent>
  </Dialog>;
};
export default SettingsDialog;
