import ImageInput from './ImageInput';

export default {
  title: 'Scope/Inputs/ImageInput',
  component: ImageInput,
};

export const Default = {
  args: {
    images: [...Array(3).keys()].map((i) => `https://picsum.photos/300/20${i}`),
  },
};
