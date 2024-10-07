import DownloadProgress from './DownloadProgress';

export default {
  title: 'Notifications/DownloadProgress',
  component: DownloadProgress,
  argTypes: {
    progress: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
  },
};

export const Default = {
  args: {
    progress: 60,
    isOpen: true,
  },
};
