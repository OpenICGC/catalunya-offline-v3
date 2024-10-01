import LocationMarkerIcon from './LocationMarkerIcon';

export default {
  title: 'Map/LocationMarkerIcon',
  component: LocationMarkerIcon,
  argTypes: {
    heading: {
      control: { type: 'range', min: 0, max: 359, step: 1 },
    },
    headingAccuracy: {
      control: { type: 'range', min: 0, max: 359, step: 1 },
    },
    color: { control: 'color' },
  },
};

export const Default = {
  args: {
    heading: 30,
    headingAccuracy: 75,
    isStale: false,
    color: '#4286f5',
  },
};

export const Stale = {
  args: {
    ...Default.args,
    isStale: true,
  },
};

export const NoHeading = {
  args: {
    ...Default.args,
    heading: undefined,
  },
};
