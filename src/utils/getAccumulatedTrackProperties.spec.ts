import {expect} from 'chai';
import {getAccumulatedProfileProperties} from './getAccumulatedProfileProperties';
import {Position} from 'geojson';

describe('getAccumulatedAscent', () => {

  it('should get the ascending accumulative difference', () => {

    // GIVEN
    const sampleCoordinates: Position[] = [
      [2, 1, 2, 0],
      [2, 4, 5, 20],
      [4, 4, 0, 40],
      [4, 6, 1, 55],
      [6, 6, 2, 70],
      [6, 2, 8, 90]
    ];

    // WHEN
    const computedIndex = getAccumulatedProfileProperties(sampleCoordinates);

    // THEN
    // eslint-disable-next-line @typescript-eslint/no-loss-of-precision
    const expectedAccumulatedTrackProperties = {ascent: 11, descent: -5, distance: 1443775.857698582, time: 90};
    expect(computedIndex).to.deep.equal(expectedAccumulatedTrackProperties);
  });
});
