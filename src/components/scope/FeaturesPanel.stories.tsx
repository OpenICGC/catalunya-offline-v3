import React from 'react';
import {Meta, Story} from '@storybook/react';

import FeaturesPanel, {FeaturesPanelProps} from './FeaturesPanel';

export default {
  title: 'Scope/FeaturesPanel',
  component: FeaturesPanel
} as Meta;

const Template: Story<FeaturesPanelProps> = args => <FeaturesPanel {...args}/>;

export const Default = Template.bind({});
Default.args = {
};
