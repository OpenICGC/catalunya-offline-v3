import StorageProgress from './StorageProgress';

export default {
  title: 'common/StorageProgress',
  component: StorageProgress,
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 100, step: 0.1 },
    },
  },
};

export const Default = {
  args: {
    progress: 38,
  },
};
