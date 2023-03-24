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
  items: [
    {
      id: uuidv4(),
      icon: <RuralAccommodation sx={{color: '#4A8A63'}}/>,
      name: 'layerManager.ruralAccommodation',
      isVisible: true
    },
    {
      id: uuidv4(),
      icon: <MountainHut sx={{color: '#D4121E'}}/>,
      name: 'layerManager.mountainHut',
      isVisible: false
    },
    {
      id: uuidv4(),
      icon: <YouthHostel sx={{color: '#1FA1E2'}}/>,
      name: 'layerManager.youthHostel',
      isVisible: true
    },
    {
      id: uuidv4(),
      icon: <Camping sx={{color: '#F1BE25'}}/>,
      name: 'layerManager.camping',
      isVisible: false
    }
  ]
};