import AcceptButton from './AcceptButton';

export default {
  title: 'Buttons/AcceptButton',
  component: AcceptButton,
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
