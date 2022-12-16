import React from 'react';
import {Meta, Story} from '@storybook/react';

import TrackPanel, {TrackPanelProps} from './TrackPanel';
import {v4 as uuidv4, v4 as uuid} from 'uuid';

export default {
  title: 'Scope/TrackPanel',
  component: TrackPanel
} as Meta;

const Template: Story<TrackPanelProps> = args => <TrackPanel {...args}/>;

export const Default = Template.bind({});
Default.args = {
  scope: {
    id: uuidv4(),
    name: 'Montseny',
    color: '#095c7a',
  },
  initialTrack: {
    type: 'Feature',
    id: uuid(),
    properties: {
      name: 'Mi traza 15',
      timestamp: Date.now(),
      description: '',
      images: [],
      color: '#973572',
      isVisible: true
    },
    geometry: {
      type: 'LineString',
      coordinates: [
        [ 1.849509, 41.609283, 142.0 ], [ 1.849479, 41.60926, 141.0 ]
      ],
    }
  },
  numPoints: 13,
  numTracks: 5
};
