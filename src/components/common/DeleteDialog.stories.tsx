import React from 'react';
import {Meta, Story} from '@storybook/react';

import DeleteDialog, {DeleteDialogProps, FEATURE_DELETED} from './DeleteDialog';

export default {
  title: 'Common/DeleteDialog',
  component: DeleteDialog,
  argTypes: {
    featureDeleted: {
      options: {
        SCOPE: FEATURE_DELETED.SCOPE,
        TRACK: FEATURE_DELETED.TRACK,
        POINT: FEATURE_DELETED.POINT
      },
      control: { type: 'inline-radio' },
    },
  }
} as Meta;

const Template: Story<DeleteDialogProps> = args => <DeleteDialog {...args}/>;

export const Default = Template.bind({});
Default.args = {
  featureDeleted: FEATURE_DELETED.SCOPE
};