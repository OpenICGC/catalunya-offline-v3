import TrackProfile from './TrackProfile';
import { Position } from 'geojson';

import sample from '../fixtures/sampleLineString.geojson';
const sampleCoordinates: Position[] = JSON.parse(sample)
  .coordinates as Position[];

export default {
  title: 'Scope/Inputs/TrackProfile',
  component: TrackProfile,
  argTypes: {
    color: { control: 'color' },
    currentPositionIndex: {
      control: {
        type: 'range',
        min: 0,
        max: sampleCoordinates && sampleCoordinates.length - 1,
        step: 1,
      },
    },
  },
};

export const Default = {
  args: {
    coordinates: sampleCoordinates,
    color: '#4d0330',
    currentPositionIndex: undefined,
    isOutOfTrack: false,
  },
};

export const Navigate = {
  args: {
    ...Default.args,
    currentPositionIndex: 17,
  },
};

export const NavigateOutOfTrack = {
  args: {
    ...Default.args,
    currentPositionIndex: 17,
    isOutOfTrack: true,
  },
};

export const WithoutHeight = {
  args: {
    ...Default.args,
    coordinates: [
      [1.849509, 41.609283],
      [1.849479, 41.60926],
    ],
  },
};

export const EmptyCoords = {
  args: {
    ...Default.args,
    coordinates: [],
  },
};

export const ZeroHeightAllPoints = {
  args: {
    ...Default.args,
    coordinates: [
      [1.849509, 41.609283, 0],
      [1.849479, 41.60926, 0],
    ],
  },
};

export const Error_NullGeometry = {
  args: {
    ...Default.args,
    coordinates: undefined,
  },
};

export const InvalidCoords = {
  args: {
    ...Default.args,
    coordinates: [
      [-250, 200, -50],
      [-200, 210, -55],
    ],
  },
};

export const NavigateFirstIndex = {
  args: {
    coordinates: sampleCoordinates,
    color: '#973572',
    currentPositionIndex: 0,
  },
};

export const NavigateLastIndex = {
  args: {
    coordinates: sampleCoordinates,
    color: '#973572',
    currentPositionIndex: sampleCoordinates.length - 1,
  },
};

export const NavigateOutOfRange = {
  args: {
    coordinates: sampleCoordinates,
    color: '#973572',
    currentPositionIndex: 1000,
  },
};
