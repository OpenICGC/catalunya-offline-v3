import React, { useState } from 'react';
import Notification from './Notification';
import { StoryFn } from '@storybook/react';

export default {
  title: 'Notifications/Notification',
  component: Notification,
  argTypes: {
    variant: {
      options: ['bottom', 'center'],
      control: { type: 'inline-radio' },
    },
  },
};

export const Persistent = {
  args: {
    message:
      'Recuerda que para ver los mapas sin conexión debes descargar el Mapa Topográfico de Catalunya.',
    isOpen: true,
    isPersistent: true,
    variant: 'bottom',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TemporaryTemplate: StoryFn = ({ value, onClose, ...args }) => {
  const [isNotificationOpen, setNotificationOpen] = useState(true);
  return (
    <Notification
      message={args.message}
      variant="bottom"
      onClose={() => setNotificationOpen(false)}
      isOpen={isNotificationOpen}
      {...args}
    />
  );
};

export const Temporary = {
  render: TemporaryTemplate,

  args: {
    message: 'Este mensaje se autodestruirá en 6 segundos.',
    isPersistent: false,
  },
};
