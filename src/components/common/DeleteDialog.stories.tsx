import DeleteDialog, {
  FEATURE_DELETED,
} from './DeleteDialog';

export default {
  title: 'Common/DeleteDialog',
  component: DeleteDialog,
  argTypes: {
    featureDeleted: {
      options: {
        SCOPE: FEATURE_DELETED.SCOPE,
        TRACK: FEATURE_DELETED.TRACK,
        POINT: FEATURE_DELETED.POINT,
      },
      control: { type: 'inline-radio' },
    },
  },
};

export const Default = {
  args: {
    featureDeleted: FEATURE_DELETED.SCOPE,
  },
};
