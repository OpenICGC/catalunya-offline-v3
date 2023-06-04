import {expect} from 'chai';
import GPXLoader from './GPXLoader';
import sampleGpx from './fixtures/sample.gpx';
import {asBlob, asDataUrl, unicodeToBase64} from './helpers';

const expectedResult = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        _gpxType: 'trk',
        name: 'Track 1',
        desc: 'A custom description',
        time: '1970-01-20T09:12:16.045Z',
        coordinateProperties: {
          times: [
            '1970-01-20T09:12:16.045Z',
            '1970-01-20T09:12:16.058Z',
            '1970-01-20T09:12:16.070Z',
            '1970-01-20T09:12:16.079Z',
            '1970-01-20T09:12:16.085Z'
          ]
        }
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [1.849509, 41.609283, 142],
          [1.849479, 41.60926, 141],
          [1.849474, 41.609236, 141],
          [1.849479, 41.609232, 141],
          [1.849478, 41.609233, 141]
        ]
      },
    },
    {
      type: 'Feature',
      properties: {
        name: 'Point 1',
        desc: 'A visible point',
        time: '2023-01-16T13:36:11.254Z'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          1.849113,
          41.608731,
          12
        ]
      }
    }
  ]
};

describe('GPXLoader', () => {

  it('should import a GPX file from a data url', async () => {
    // GIVEN
    const url = asDataUrl(unicodeToBase64(sampleGpx), 'application/gpx+xml');

    // WHEN
    const result = await GPXLoader.load(url);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should import a GPX file from a Blob', async () => {
    // GIVEN
    const blob = asBlob(sampleGpx, 'application/gpx+xml');

    // WHEN
    const result = await GPXLoader.load(blob);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });
});
