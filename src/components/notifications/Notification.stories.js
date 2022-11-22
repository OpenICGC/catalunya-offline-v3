import React, {useState} from 'react';
import Notification from './Notification';

export default {
  title: 'Notifications/Notification',
  component: Notification
};

const Template = args => <Notification {...args}/>;

export const Persistent = Template.bind({});
Persistent.args = {
  message: 'Recuerda que para ver los mapas sin conexión debes descargar el Mapa Topográfico de Catalunya.',
  isOpen: true,
  isPersistent: true
};

// eslint-disable-next-line react/prop-types,no-unused-vars
const TemporaryTemplate = ({value, onClose, ...args}) => {
  const [isNotificationOpen, setNotificationOpen] = useState(true);
  return <Notification onClose={() => setNotificationOpen(false)} isOpen={isNotificationOpen} {...args} />;
};

export const Temporary = TemporaryTemplate.bind({});
Temporary.args = {
  message: 'Este mensaje se autodestruirá en 6 segundos.',
  isPersistent: false
};
