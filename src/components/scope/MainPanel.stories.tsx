import React, { useCallback, useState } from 'react';
import MainPanel, { MainPanelProps } from './MainPanel';
import { StoryFn } from '@storybook/react';

//MUI
import Stack from '@mui/material/Stack';

//UTILS
import { v4 as uuidv4 } from 'uuid';
import { DRAWER_WIDTH } from '../../config';
import { HEXColor, UUID, Scope } from '../../types/commonTypes';

export default {
  title: 'Scope/MainPanel',
  component: MainPanel,
};

const stackSx = {
  height: '500px',
  width: DRAWER_WIDTH,
  boxShadow: 3,
  overflow: 'hidden',
  m: 0,
  p: 0,
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagedTemplate: StoryFn<MainPanelProps> = ({scopes, onAdd, onColorChange, onRename, onDelete, ...args}) => {
  const [getScopes, setScopes] = useState<Array<Scope>>(scopes);

  const handleAdd = useCallback(
    () =>
      setScopes((prevScopes) => [
        ...prevScopes,
        {
          id: uuidv4(),
          name: 'Nuevo ámbito',
          color: '#973572',
        },
      ]),
    [],
  );
  const handleColorChange = useCallback(
    (scopeId: UUID, color: HEXColor) =>
      setScopes((prevScopes) =>
        prevScopes.map((scope) =>
          scope.id === scopeId ? { ...scope, color } : scope,
        ),
      ),
    [],
  );
  const handleRename = useCallback(
    (scopeId: UUID, name: string) =>
      setScopes((prevScopes) =>
        prevScopes.map((scope) =>
          scope.id === scopeId ? { ...scope, name } : scope,
        ),
      ),
    [],
  );
  const handleDelete = useCallback(
    (scopeId: UUID) =>
      setScopes((prevScopes) =>
        prevScopes.filter((scope) => scope.id !== scopeId),
      ),
    [],
  );

  return (
    <Stack sx={stackSx}>
      <MainPanel
        scopes={getScopes}
        onAdd={handleAdd}
        onColorChange={handleColorChange}
        onRename={handleRename}
        onDelete={handleDelete}
        {...args}
      />
    </Stack>
  );
};

const DeviceTemplate: StoryFn<MainPanelProps> = (args) => (
  <Stack sx={stackSx}>
    <MainPanel {...args} />
  </Stack>
);

export const Default = {
  args: {
    scopes: [...Array(20).keys()].map((i) => ({
      id: uuidv4(),
      name: `Mi ámbito ${i}`,
      color: '#973572',
      isVisible: true,
      isEditing: false,
    })),
  },
};

export const Managed = {
  render: ManagedTemplate,

  args: {
    ...Default.args,
  },
};

export const Empty = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
    scopes: [],
  },
};

export const Device = {
  render: DeviceTemplate,

  args: {
    ...Default.args,
  },
};
