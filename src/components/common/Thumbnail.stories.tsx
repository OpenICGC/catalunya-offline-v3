import Thumbnail from './Thumbnail';

export default {
  title: 'Common/Thumbnail',
  component: Thumbnail,
};

export const Default = {
  args: {
    image: 'https://picsum.photos/300/200',
    isDeletable: false,
  },
};

export const Loading = {
  args: {
    image: 'https://picsum.photos/300/200',
    isDeletable: false,
  },
};

export const Deletable = {
  args: {
    image: 'https://picsum.photos/300/200',
    isDeletable: true,
  },
};
