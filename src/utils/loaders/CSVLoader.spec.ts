import {expect} from 'chai';
import {asBlob, asDataUrl, unicodeToBase64} from './helpers';
import CSVLoader from './CSVLoader';

import sampleCsv from './fixtures/sample.csv';
import sampleNoLatLonCsv from './fixtures/sample-no-lat-lon.csv';

const expectedResult = {
  type: 'FeatureCollection',
  features: [
    {type: 'Feature', geometry: {type: 'Point', coordinates: [0.789859584, 42.22387057]}, properties: {id: 8, title: 'Abadia, tossal de l\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [1.038428928, 41.54842803]}, properties: {id: 21, title: 'Abat, tossal de l\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [2.891804967, 41.71734686]}, properties: {id: 42, title: 'Abella, puig de l\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [0.596500139, 41.56793944]}, properties: {id: 55, title: 'Abellar, l\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [2.625349136, 41.85099114]}, properties: {id: 72, title: 'Abellera, roca'}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [0.819334004, 42.59816107]}, properties: {id: 77, title: 'Abellers, pic d\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [3.045768753, 41.83898340]}, properties: {id: 84, title: 'Abells, puig dels'}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [2.314976364, 42.14857831]}, properties: {id: 112, title: 'Abric, puig de l\''}},
    {type: 'Feature', geometry: {type: 'Point', coordinates: [1.123277246, 42.09383364]}, properties: {id: 117, title: 'Abudell, l\''}}
  ]
};

describe('CSVLoader', () => {

  it('should import a CSV file from a data url', async () => {
    // GIVEN
    const url = asDataUrl(unicodeToBase64(sampleCsv), 'text/csv');

    // WHEN
    const result = await CSVLoader.load(url);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should import a CSV file from a Blob', async () => {
    // GIVEN
    const blob = asBlob(sampleCsv, 'text/csv');

    // WHEN
    const result = await CSVLoader.load(blob);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should error if CSV doesn\'t have "lat" and "lon" columns', async () => {
    // GIVEN
    const blob = asBlob(sampleNoLatLonCsv, 'text/csv');

    // WHEN
    try {
      await CSVLoader.load(blob);
    } catch (err) {
      // THEN
      expect((err as Error).message).to.deep.equal('CSV: "lat" and a "lon" columns are mandatory');
    }
  });

});
