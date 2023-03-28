import React from 'react';
import {Meta, Story} from '@storybook/react';

import SettingsDialog, {SettingsDialogProps} from './SettingsDialog';
import {COLOR_PALETTES} from '../../config';
import {LANGUAGE} from '../../types/commonTypes';

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
  gpsPositionColor: '#4286f5',
  trackTolerance: 40,
  isLeftHanded: true,
  isLargeSize: false,
  colorPalette: 'BrewerSpectral9',
  language: LANGUAGE.ca
};
