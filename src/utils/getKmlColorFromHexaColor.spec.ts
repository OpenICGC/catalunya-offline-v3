import {expect} from 'chai';
import {getKmlColorFromHexaColor} from './getKmlColorFromHexaColor';

describe('getKmlColorFromHexaColor', () => {
  
  it('should convert hexadecimal color to kml color', async () => {

    // GIVEN
    const hexaColor = '#123456';

    // WHEN
    const computedColor = getKmlColorFromHexaColor(hexaColor);

    //WHEN
    expect(computedColor).to.deep.equal('ff563412');

  });

});