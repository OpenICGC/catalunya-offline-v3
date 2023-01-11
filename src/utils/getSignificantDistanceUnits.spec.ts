import {expect} from 'chai';
import {getSignificantDistanceUnits} from './getSignificantDistanceUnits';

describe('getSignificantDistanceUnits', () => {

  it('getSignificantDistanceUnits should get m without float when distance is less than 1000m', () => {

    // GIVEN
    const sampleDistance = 253.5213;

    // WHEN
    const computedDistance = getSignificantDistanceUnits(sampleDistance);

    // THEN
    const expectedDistanceUnits = '254 m';
    expect(computedDistance).to.deep.equal(expectedDistanceUnits);
  });
  
  it('getSignificantDistanceUnits should get km with two floats when distance is between 1000m and 1000000m', () => {

    // GIVEN
    const sampleDistance = 125352;

    // WHEN
    const computedDistance = getSignificantDistanceUnits(sampleDistance);

    // THEN
    const expectedDistanceUnits = '125.35 km';
    expect(computedDistance).to.deep.equal(expectedDistanceUnits);
  });

  it('getSignificantDistanceUnits should get km without float when distance is more than 1000000m', () => {

    // GIVEN
    const sampleDistance = 12585352;

    // WHEN
    const computedDistance = getSignificantDistanceUnits(sampleDistance);

    // THEN
    const expectedDistanceUnits = '12585 km';
    expect(computedDistance).to.deep.equal(expectedDistanceUnits);
  });
    
});