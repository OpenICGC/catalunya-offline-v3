import {expect} from 'chai';

import GeoJSONLoader from './GeoJSONLoader';

import file from '!raw-loader!./fixtures/sample.geojson';

const expectedResult = JSON.parse(file);

const asDataUrl = (str: string, mimeType: string) => `data:${mimeType};base64,${window.btoa(str)}`;
const asBlob = (str: string, mimeType: string) => new Blob([str], {type: mimeType});

describe('GeoJSONLoader', () => {

  it('should import a GeoJSON file from a data url', async () => {
    // GIVEN
    const url = asDataUrl(file, 'application/geo+json');

    // WHEN
    const result = await GeoJSONLoader.load(url);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });

  it('should import a GeoJSON file from a Blob', async () => {
    // GIVEN
    const blob = asBlob(file, 'application/geo+json');

    // WHEN
    const result = await GeoJSONLoader.load(blob);

    // THEN
    expect(result).to.deep.equal(expectedResult);
  });
});
