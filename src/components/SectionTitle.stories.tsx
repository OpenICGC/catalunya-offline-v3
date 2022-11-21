import React from 'react';
import SectionTitle, {SectionTitleProps} from './SectionTitle';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Common/SectionTitle',
  component: SectionTitle,
} as Meta;

const Template: Story<SectionTitleProps> = (args) => <SectionTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
  titleKey: 'baseMapManager',
};
