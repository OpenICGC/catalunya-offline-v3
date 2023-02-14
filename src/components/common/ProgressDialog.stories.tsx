import React from 'react';
import {Meta, Story} from '@storybook/react';

import ProgressDialog from './ProgressDialog';

export default {
  title: 'Common/ProgressDialog',
  component: ProgressDialog,
} as Meta;

const Template: Story = args => <ProgressDialog {...args}/>;

export const Default = Template.bind({});

