import FabButton, { LOCATION_STATUS } from './FabButton';

export default {
  title: 'Buttons/FabButton',
  component: FabButton,
  argTypes: {
    bearing: {
      control: {
        type: 'range',
        min: 0,
        max: 359,
        step: 1,
      },
    },
    pitch: {
      control: {
        type: 'range',
        min: 0,
        max: 80,
        step: 1,
      },
    },
    locationStatus: {
      options: {
        DISABLED: 0,
        NOT_TRACKING: 1,
        TRACKING: 2,
        NAVIGATING: 3,
      },
      type: 'inline-radio',
    },
  },
};

export const Default = {
  args: {
    isFabOpen: true,
    bearing: 0,
    pitch: 0,
    locationStatus: LOCATION_STATUS.NOT_TRACKING,
  },
};

export const Bearing30 = {
  args: {
    ...Default.args,
    bearing: 30,
  },
};

export const LocationDisabled = {
  args: {
    ...Default.args,
    locationStatus: LOCATION_STATUS.DISABLED,
  },
};

export const Tracking = {
  args: {
    ...Default.args,
    locationStatus: LOCATION_STATUS.TRACKING,
  },
};

export const Navigating = {
  args: {
    ...Default.args,
    locationStatus: LOCATION_STATUS.NAVIGATING,
  },
};

export const LeftHanded = {
  args: {
    ...Default.args,
  },
};

export const Accessible = {
  args: {
    ...Default.args,
  },
};
