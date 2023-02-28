import React from 'react';
import {Meta, Story} from '@storybook/react';

import Settings, {SettingsProps} from './Settings';
import {COLOR_PALETTES, GPS_POSITION_COLOR} from '../../config';

export default {
  title: 'Common/Settings',
  component: Settings,
  argTypes: {
    positionColor: {control: 'color'},
    selectedSizeId: {
      options: ['small', 'large'],
      control: {type: 'inline-radio'}
    },
    selectedLanguageId: {
      options: ['ca', 'en', 'es'],
      control: {type: 'inline-radio'}
    },
    trackTolerance: {
      control: {
        type: 'range',
        min: 0,
        max: 1000,
        step: 1
      }
    },
    selectedPaletteIndex: {
      control: {
        type: 'range',
        min: 0,
        max: COLOR_PALETTES.length-1,
        step: 1
      }
    }
  }
} as Meta;

const Template: Story<SettingsProps> = args => <Settings {...args}/>;
export const Default = Template.bind({});
Default.args = {
  positionColor: GPS_POSITION_COLOR,
  selectedLanguageId: 'ca',
  selectedSizeId: 'small',
  selectedPaletteIndex: 0,
  trackTolerance: 40,
  isLeftHanded: true
};