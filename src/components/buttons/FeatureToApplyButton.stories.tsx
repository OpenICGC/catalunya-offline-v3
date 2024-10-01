import FeatureToApplyButton, {
  FEATURE_APPLIED,
} from './FeatureToApplyButton';

export default {
  title: 'Buttons/FeatureToApplyButton',
  component: FeatureToApplyButton,
  argTypes: {
    feature: {
      options: {
        POINT: FEATURE_APPLIED.POINT,
        TRACK: FEATURE_APPLIED.TRACK,
      },
      control: { type: 'inline-radio' },
    },
  },
};

export const Default = {
  args: {
    isSelected: true,
    feature: FEATURE_APPLIED.POINT,
  },
};
