import TextAreaInput from './TextAreaInput';

export default {
  title: 'Scope/Inputs/TextAreaInput',
  component: TextAreaInput,
};

export const Default = {
  args: {
    isEditing: true,
    text: 'Había un árbol con el tronco torcido en medio del camino.',
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
