import {expect} from 'chai';
import {getAccumulatedTrackProperties} from './getAccumulatedTrackProperties';
import {v4 as uuid} from 'uuid';
import {ScopeTrack} from '../types/commonTypes';

describe('getAccumulatedAscent', () => {
  const scopeId = uuid();

  it('getAccumulatedAscent should get the ascending accumulative difference', () => {

    // GIVEN
    const sampleScopeTrack: ScopeTrack = {
      type: 'Feature',
      id: scopeId,
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
          [2, 1, 2, 0],
          [2, 4, 5, 20],
          [4, 4, 0, 40],
          [4, 6, 1, 55],
          [6, 6, 2, 70],
          [6, 2, 8, 90]
        ]
      }
    };

    // WHEN
    const computedIndex = getAccumulatedTrackProperties(sampleScopeTrack);

    // THEN
    const expectedAccumulatedTrackProperties = { ascent: 11, descent: -5, distance: 1365079.8625570554, time: 90 };
    expect(computedIndex).to.deep.equal(expectedAccumulatedTrackProperties);
  });
});