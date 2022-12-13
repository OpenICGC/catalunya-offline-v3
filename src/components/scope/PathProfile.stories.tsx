import React from 'react';
import {Meta, Story} from '@storybook/react';

import PathProfile, {PathProfileProps} from './PathProfile';

export default {
  title: 'Scope/PathProfile',
  component: PathProfile,
  argTypes: {
    color: {control: 'color'}
  }
} as Meta;

const Template: Story<PathProfileProps> = args => <PathProfile {...args}/>;

export const Default = Template.bind({});
Default.args = {
  path: [
    {
      length: 0,
      height: 10
    },
    {
      length: 5,
      height: 0
    },
    {
      length: 10,
      height: 20
    },
    {
      length: 15,
      height: 30
    },
    {
      length: 20,
      height: 25
    },
    {
      length: 25,
      height: 10
    },
    {
      length: 30,
      height: 10
    },
    {
      length: 35,
      height: 15
    },
    {
      length: 40,
      height: 10
    },
    {
      length: 45,
      height: 35
    },
    {
      length: 50,
      height: 25
    },
    {
      length: 55,
      height: 20
    },
    {
      length: 20,
      height: 25
    },
    {
      length: 25,
      height: 10
    },
    {
      length: 30,
      height: 10
    },
    {
      length: 35,
      height: 15
    },
    {
      length: 40,
      height: 10
    },
    {
      length: 45,
      height: 35
    },
    {
      length: 50,
      height: 25
    },
    {
      length: 55,
      height: 20
    },
    {
      length: 60,
      height: 25
    },
    {
      length: 65,
      height: 10
    },
    {
      length: 70,
      height: 10
    },
    {
      length: 75,
      height: 15
    },
    {
      length: 80,
      height: 10
    },
    {
      length: 85,
      height: 35
    },
    {
      length: 90,
      height: 25
    },
    {
      length: 95,
      height: 20
    },
  ],
  color: '#973572',
};

export const Navigate = Template.bind({});
Navigate.args = {
  ...Default.args,
  user: {
    length: 25,
    height: 10
  }
};

  