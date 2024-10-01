import ShareDialog, { FEATURE_SHARED } from './ShareDialog';

export default {
  title: 'Common/ShareDialog',
  component: ShareDialog,
  argTypes: {
    featureShared: {
      options: {
        SCOPE: FEATURE_SHARED.SCOPE,
        TRACK: FEATURE_SHARED.TRACK,
      },
      control: { type: 'inline-radio' },
    },
  },
};

export const Default = {
  args: {
    featureShared: FEATURE_SHARED.SCOPE,
  },
};
