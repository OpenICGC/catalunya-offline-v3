import React, {useState} from 'react';
import Notification, {NotificationProps} from './Notification';
import {Meta, Story} from '@storybook/react';

export default {
  title: 'Notifications/Notification',
  component: Notification
} as Meta;

const Template: Story<NotificationProps> = args => <Notification {...args}/>;

export const Persistent = Template.bind({});
Persistent.args = {
  message: 'Recuerda que para ver los mapas sin conexión debes descargar el Mapa Topográfico de Catalunya.',
  isOpen: true,
  isPersistent: true
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TemporaryTemplate: Story = ({value, onClose, ...args}) => {
  const [isNotificationOpen, setNotificationOpen] = useState(true);
  return <Notification message={args.message} onClose={() => setNotificationOpen(false)} isOpen={isNotificationOpen} {...args} />;
};

export const Temporary = TemporaryTemplate.bind({});
Temporary.args = {
  message: 'Este mensaje se autodestruirá en 6 segundos.',
  isPersistent: false
};
