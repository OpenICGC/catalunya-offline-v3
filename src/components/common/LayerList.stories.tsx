import React from 'react';
import {Meta, Story} from '@storybook/react';

import LayerList, {LayerListProps} from './LayerList';
import {v4 as uuidv4} from 'uuid';

//ICONS
import YouthHostel from '../icons/YouthHostel';
import Camping from '../icons/Camping';
import MountainHut from '../icons/MountainHut';
import RuralAccommodation from '../icons/RuralAccommodation';

export default {
  title: 'Common/LayerList',
  component: LayerList
} as Meta;

const Template: Story<LayerListProps> = args => <LayerList {...args}/>;

export const Default = Template.bind({});
Default.args = {
  isLargeSize: false,
  items: [
    {
      id: uuidv4(),
      icon: <RuralAccommodation sx={{color: '#4A8A63'}}/>,
      name: 'Alojamientos rurales',
      isActive: true
    },
    {
      id: uuidv4(),
      icon: <MountainHut sx={{color: '#D4121E'}}/>,
      name: 'Refugios',
      isActive: false
    },
    {
      id: uuidv4(),
      icon: <YouthHostel sx={{color: '#1FA1E2'}}/>,
      name: 'Albergues',
      isActive: true
    },
    {
      id: uuidv4(),
      icon: <Camping sx={{color: '#F1BE25'}}/>,
      name: 'Campings',
      isActive: false
    }
  ]
};