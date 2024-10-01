import GeometryThumbnail from './GeometryThumbnail';
import GeoJSON from 'geojson';
import sample from '../fixtures/sampleLineString.geojson';
const sampleGeometry: GeoJSON.LineString = JSON.parse(
  sample,
) as GeoJSON.LineString;

export default {
  title: 'Scope/Inputs/GeometryThumbnail',
  component: GeometryThumbnail,
  argTypes: {
    color: {
      control: 'color',
    },
    size: {
      control: { type: 'range', min: 16, max: 512, step: 1 },
    },
  },
};

export const Default = {
  args: {
    geometry: sampleGeometry,
  },
};
