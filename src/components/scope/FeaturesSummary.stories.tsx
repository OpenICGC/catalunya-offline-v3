import FeaturesSummary from './FeaturesSummary';

export default {
  title: 'Scope/FeaturesSummary',
  component: FeaturesSummary,
  argTypes: {
    colorContrastFrom: { control: 'color' },
  },
};

export const Default = {
  args: {
    numPoints: 17,
    numTracks: 5,
    colorContrastFrom: '#ffffff',
  },
};
