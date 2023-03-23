import React from 'react';
import {Meta, Story} from '@storybook/react';

import LayerList, {LayerListProps} from './LayerList';
import {v4 as uuidv4} from 'uuid';

//ICONS
import Hostel from '../icons/Hostel';
import Camping from '../icons/Camping';
import Refuge from '../icons/Refuge';
import RuralTurism from '../icons/RuralTurism';

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
      icon: <RuralTurism sx={{color: '#4A8A63'}}/>,
      name: 'Alojamientos rurales',
      isActive: true
    },
    {
      id: uuidv4(),
      icon: <Refuge sx={{color: '#D4121E'}}/>,
      name: 'Refugios',
      isActive: false
    },
    {
      id: uuidv4(),
      icon: <Hostel sx={{color: '#1FA1E2'}}/>,
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