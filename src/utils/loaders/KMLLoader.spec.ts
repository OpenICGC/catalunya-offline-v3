import {expect} from 'chai';
import KMLLoader from './KMLLoader';
import sampleKml from './fixtures/sample.kml';
import {asBlob, asDataUrl, unicodeToBase64} from './helpers';

const expectedResult = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        description: 'Point 1 description',
        'icon-color': '#973572',
        'icon-opacity': 1,
        'label-scale': 1,
        name: 'Point 1',
        styleHash: '-626a2be',
        styleMapHash: {
          highlight: '#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight',
          normal: '#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596-normal'
        },
        styleUrl: '#874bf4f0-4a3f-4c75-972f-fb9b8ac4a596'
      },
      geometry: {
        type: 'Point',
        coordinates: [
          -3.698005,
          40.402501,
          0
        ]
      }
    },
    {
      type: 'Feature',
      properties: {
        description: 'Point 2 description',
        'icon-color': '#973572',
        'icon-opacity': 1,
        'label-scale': 1,
        name: 'Point 2',
        styleHash: '-268d99cb',
        styleMapHash: {
          highlight: '#35de56eb-7c9d-405d-8d6c-147e083cb6bf-highlight',
          normal: '#35de56eb-7c9d-405d-8d6c-147e083cb6bf-normal'
        },
        styleUrl: '#35de56eb-7c9d-405d-8d6c-147e083cb6bf'
      },
      geometry: {
        coordinates: [
          -3.698864176137905,
          40.40192130721456,
          0
        ],
        type: 'Point'
      }
    },
    {
      type: 'Feature',
      properties: {
        description: 'Track 1 description',
        name: 'Track 1',
        'stroke': '#973572',
        'stroke-opacity': 1,
        'stroke-width': 5,
        styleHash: '-609422ab',
        styleMapHash: {
          highlight: '#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-highlight',
          normal: '#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596-normal'
        },
        styleUrl: '#e73af4f0-4a3f-4c75-972f-fb9b8ac4a596'
      },
      geometry: {
        type: 'LineString',
        coordinates: [
          [
            -3.698053272441833,
            40.40243085733725,
            0
          ],
          [
            -3.697723976621552,
            40.40272136663401,
            0
          ],
          [
            -3.695985219357802,
            40.40257933830212,
            0
          ],
          [
            -3.696128879062175,
            40.40098962237379,
            0
          ],
          [
            -3.698789629333535,
            40.40101458330396,
            0
          ],
          [
            -3.699582462026573,
            40.40127776668836,
            0
          ]
        ]
      }
    }
  ]
};

describe('KMLLoader', () => {

  it('should import a KML file from a data url', async () => {
    // GIVEN
    const url = asDataUrl(unicodeToBase64(sampleKml), 'application/vnd.google-earth.kml+xml');

    // WHEN
    const result = await KMLLoader.load(url);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should import a KML file from a Blob', async () => {
    // GIVEN
    const blob = asBlob(sampleKml, 'application/vnd.google-earth.kml+xml');

    // WHEN
    const result = await KMLLoader.load(blob);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });
});
