import React, {useCallback, useState} from 'react';
import MainPanel, {MainPanelProps} from './MainPanel';
import {Meta, Story} from '@storybook/react';

//MUI
import Stack from '@mui/material/Stack';

//UTILS
import {v4 as uuidv4} from 'uuid';
import {DRAWER_WIDTH} from '../../config';
import {listItemType} from './ListItem';
import {HEXColor, UUID} from '../../types/commonTypes';


export default {
  title: 'Scope/MainPanel',
  component: MainPanel
} as Meta;

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0
};

const Template: Story<MainPanelProps> = args => <MainPanel {...args}/>;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: Story<MainPanelProps> = ({items, onAdd, onColorChange, onRename, onDelete, ...args}) => {
  const [getItems, setItems] = useState<Array<listItemType>>(items);

  const handleAdd = useCallback(() => setItems(
    prevItems => ([...prevItems, {
      id: uuidv4(),
      name: 'Nuevo ámbito',
      color: '#fabada',
      isActive: true
    }])
  ), []);
  const handleColorChange = useCallback((color: HEXColor, itemId: UUID) => setItems(
    prevItems => prevItems.map(item => item.id === itemId ? {...item, color} : item)
  ), []);
  const handleRename = useCallback((name: string, itemId: UUID) => setItems(
    prevItems => prevItems.map(item => item.id === itemId ? {...item, name} : item)
  ), []);
  const handleDelete = useCallback((itemId: UUID) => setItems(
    prevItems => prevItems.filter(item => item.id !== itemId)
  ), []);

  return <Stack sx={stackSx}>
    <MainPanel
      items={getItems}
      onAdd={handleAdd}
      onColorChange={handleColorChange}
      onRename={handleRename}
      onDelete={handleDelete}
      {...args}
    />
  </Stack>;
};

const DeviceTemplate: Story<MainPanelProps> = args =>
  <Stack sx={stackSx}>
    <MainPanel {...args}/>
  </Stack>;

export const Default = Template.bind({});
Default.args = {
  items: [...Array(20).keys()].map(i => ({
    id: uuidv4(),
    name: `Mi ámbito ${i}`,
    color: '#fabada',
    isActive: true,
    isEditing: false
  }))
};

export const Managed = ManagedTemplate.bind({});
Managed.args = {
  ...Default.args
};

export const Empty = DeviceTemplate.bind({});
Empty.args = {
  ...Default.args,
  items: []

};

export const Device = DeviceTemplate.bind({});
Device.args = {
  ...Default.args
};
