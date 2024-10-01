import DateInput from './DateInput';

export default {
  title: 'Scope/Inputs/DateInput',
  component: DateInput,
};

export const Default = {
  args: {
    isEditing: true,
    timestamp: Date.now(),
    sx: {
      '&.GenericInput-wrapper': {
        padding: '8px',
        marginBottom: '0px',
      },
      '& .GenericInput-title': {
        color: 'grey.600',
      },
    },
  },
};
