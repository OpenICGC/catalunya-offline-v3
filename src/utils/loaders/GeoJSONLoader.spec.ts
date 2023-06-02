import {expect} from 'chai';
import GeoJSONLoader from './GeoJSONLoader';
import sampleGeojson from './fixtures/sample.geojson';

const expectedResult = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: '55610ca2-9e2a-41bf-a6fa-c603181f9c4a',
      properties: {
        name: 'Point 1',
        color: '#973572',
        timestamp: 1673876171254,
        description: 'Point 1 description',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    },
    {
      type: 'Feature',
      id: 'b903b3ee-d5b5-4ec8-b23a-bbcde4b808f2',
      properties: {
        name: 'Point 2',
        color: '#973572',
        timestamp: 1673876171245,
        description: 'Point 2 description',
        images: [],
        isVisible: false
      },
      geometry: {
        type: 'Point',
        coordinates: [1, 1]
      }
    },
    {
      type: 'Feature',
      id: '1df93aae-d842-41c8-b370-0b6320a212d3',
      properties: {
        name: 'Track 1',
        color: '#973572',
        timestamp: 1673876115769,
        description: 'Track 1 description',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [1, 1]]
      }
    },
    {
      type: 'Feature',
      id: '6505bfe9-d478-41be-8b41-81934e42a3bb',
      properties: {
        name: 'Track 2',
        color: '#973572',
        timestamp: 1673876115785,
        description: 'Track 1 description',
        images: [],
        isVisible: false
      },
      geometry: {
        type: 'LineString',
        coordinates: [[2, 2], [3, 3]]
      }
    }
  ]
};

const asDataUrl = (str: string, mimeType: string) => `data:${mimeType};base64,${window.btoa(str)}`;
const asBlob = (str: string, mimeType: string) => new Blob([str], {type: mimeType});

describe('GeoJSONLoader', () => {

  it('should import a GeoJSON file from a data url', async () => {
    // GIVEN
    const url = asDataUrl(sampleGeojson, 'application/geo+json');

    // WHEN
    const result = await GeoJSONLoader.load(url);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should import a GeoJSON file from a Blob', async () => {
    // GIVEN
    const blob = asBlob(sampleGeojson, 'application/geo+json');

    // WHEN
    const result = await GeoJSONLoader.load(blob);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });
});
