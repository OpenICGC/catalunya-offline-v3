import React from 'react';
import Header from './Header';

export default {
  title: 'Scope/Header',
  component: Header,
  argTypes: {
    color: { control: 'color' },
  },
};

const Template = args => <Header {...args}/>;

export const Default = Template.bind({});
Default.args = {
  name: 'Montseny',
  color: '#ccf598',
  numPoints: 15,
  numPaths: 7
};

export const Long = Template.bind({});
Long.args = {
  name: 'Artesa de Segre con amigos',
  color: '#ccf598',
  numPoints: 15,
  numPaths: 7
};