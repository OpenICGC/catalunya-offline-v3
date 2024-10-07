import SettingsDialog from './SettingsDialog';
import { COLOR_PALETTES } from '../../config';
import { LANGUAGE } from '../../types/commonTypes';

export default {
  title: 'Common/Settings',
  component: SettingsDialog,
  argTypes: {
    gpsPositionColor: {
      control: 'color',
    },
    trackTolerance: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 1,
      },
    },
    colorPalette: {
      options: Object.keys(COLOR_PALETTES),
      control: {
        type: 'select',
      },
    },
    language: {
      options: {
        CA: LANGUAGE.ca,
        EN: LANGUAGE.en,
        ES: LANGUAGE.es,
      },
      control: {
        type: 'inline-radio',
      },
    },
  },
};

export const Default = {
  args: {
    gpsPositionColor: '#4286f5',
    trackTolerance: 40,
    isLeftHanded: true,
    isLargeSize: false,
    colorPalette: 'BrewerSpectral9',
    language: LANGUAGE.ca,
  },
};
