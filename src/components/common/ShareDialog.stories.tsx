import React from 'react';
import {Meta, Story} from '@storybook/react';

import ShareDialog, {FEATURE_SHARED, ShareDialogProps} from './ShareDialog';

export default {
  title: 'Common/ShareDialog',
  component: ShareDialog,
  argTypes: {
    featureShared: {
      options: {
        SCOPE: FEATURE_SHARED.SCOPE,
        TRACK: FEATURE_SHARED.TRACK,
        POINT: FEATURE_SHARED.POINT
      },
      control: { type: 'inline-radio' },
    },
  }} as Meta;

const Template: Story<ShareDialogProps> = args => <ShareDialog {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isAccesibleSize: false,
  featureShared: FEATURE_SHARED.SCOPE
};