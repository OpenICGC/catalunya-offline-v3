import React from 'react';
import SectionTitle from './SectionTitle';

export default {
  title: 'Common/SectionTitle',
  component: SectionTitle,
};

const Template = (args) => <SectionTitle {...args} />;

export const Default = Template.bind({});
Default.args = {
  titleKey: 'baseMapStyle',
};
