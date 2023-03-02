import React from 'react';
import {Meta, Story} from '@storybook/react';

import ScopeSelector, {ScopeSelectorProps} from './ScopeSelector';

//UTILS
import {v4 as uuidv4} from 'uuid';
import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

export default {
  title: 'Scope/ScopeSelector',
  component: ScopeSelector
} as Meta;

const Template: Story<ScopeSelectorProps> = args => <ScopeSelector {...args}/>;

const palette = useColorRamp('BrewerDark27').hexColors;

export const Default = Template.bind({});
Default.args = {
  isAccessibleSize: false,
  scopes: [...Array(25).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi ámbito ${i}`,
    color: palette[Math.floor(Math.random() * palette.length)], // Color asignado la mitad de las veces
    isActive: Math.random() < 0.5
  }))
};
