import React from 'react';
import {Meta, Story} from '@storybook/react';

import LayerItem, {LayerItemProps} from './LayerItem';
import HouseIcon from '@mui/icons-material/House';

export default {
  title: 'Common/LayerItem',
  component: LayerItem
} as Meta;

const Template: Story<LayerItemProps> = args => <LayerItem {...args}/>;

export const Default = Template.bind({});
Default.args = {
  itemId: 666,
  icon: <HouseIcon/>,
  name: 'Refugios',
  isVisible: true
};