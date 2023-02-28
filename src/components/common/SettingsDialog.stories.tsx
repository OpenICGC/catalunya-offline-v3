import React from 'react';
import {Meta, Story} from '@storybook/react';

import SettingsDialog, {SettingsDialogProps} from './SettingsDialog';
import {COLOR_PALETTES, GPS_POSITION_COLOR} from '../../config';
import {BUTTON_SIZE, LANGUAGE} from '../../types/commonTypes';

export default {
  title: 'Common/Settings',
  component: SettingsDialog,
  argTypes: {
    gpsPositionColor: {
      control: 'color'
    },
    trackTolerance: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 1
      }
    },
    buttonSize: {
      options: {
        SMALL: BUTTON_SIZE.small,
        LARGE: BUTTON_SIZE.large
      },
      control: {
        type: 'inline-radio'
      }
    },
    colorPalette: {
      options: Object.keys(COLOR_PALETTES),
      control: {
        type: 'select'
      }
    },
    language: {
      options: {
        CA: LANGUAGE.ca,
        EN: LANGUAGE.en,
        ES: LANGUAGE.es
      },
      control: {
        type: 'inline-radio'
      }
    }
  }
} as Meta;

const Template: Story<SettingsDialogProps> = args => <SettingsDialog {...args}/>;
export const Default = Template.bind({});
Default.args = {
  gpsPositionColor: GPS_POSITION_COLOR,
  trackTolerance: 40,
  isLeftHanded: true,
  buttonSize: BUTTON_SIZE.small,
  colorPalette: 'BrewerSpectral9',
  language: LANGUAGE.ca
};
