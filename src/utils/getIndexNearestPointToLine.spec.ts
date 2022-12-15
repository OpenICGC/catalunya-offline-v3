import {expect} from 'chai';
import {getIndexNearestPointToLine} from './getIndexNearestPointToLine';
import {v4 as uuid} from 'uuid';
import {ScopePath} from '../types/commonTypes';

describe('getIndexNearestPointToLine', () => {
  const scopeId = uuid();

  it('getIndexNearestPointToLine should get nearest Point to Line', () => {

    // GIVEN
    const sampleScopePath: ScopePath = {
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
          [1,1],
          [4,3],
          [7,3],
          [7,1]
        ],
      }
    };
    const samplePoint: GeoJSON.Position = [ 4, 4 ];

    // WHEN
    const computedIndex = getIndexNearestPointToLine(sampleScopePath, samplePoint);

    // THEN
    const expectedIndex = 1;
    expect(computedIndex).to.deep.equal(expectedIndex);
  });
});