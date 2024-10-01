import CancelButton from './CancelButton';

export default {
  title: 'Buttons/CancelButton',
  component: CancelButton,
  argTypes: {
    variant: {
      options: ['text', 'contained'],
      control: { type: 'inline-radio' },
    },
  },
};

export const Default = {
  args: {
    variant: 'text',
    disabled: false,
  },
};
